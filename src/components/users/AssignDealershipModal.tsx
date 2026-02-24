import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Building2, Loader2 } from "lucide-react";
import type { UserListItem } from "@/lib/api";
import { useDealershipsList } from "@/hooks/useDealerships";

interface AssignDealershipModalProps {
  user: UserListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onAssign: (userId: string, dealershipIds: string[]) => Promise<void>;
  isSubmitting: boolean;
}

export function AssignDealershipModal({
  user,
  open,
  onOpenChange,
  onSuccess,
  onAssign,
  isSubmitting,
}: AssignDealershipModalProps) {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useDealershipsList({
    page: 1,
    limit: 100,
    search: searchQuery,
  });

  const dealerships = useMemo(() => data?.data?.dealerships ?? [], [data]);
  const currentUserDealershipIds = useMemo(
    () => (user?.dealerships?.length ? user.dealerships.map((d) => d.id) : []),
    [user]
  );

  useEffect(() => {
    if (open && user) {
      setSelectedIds(new Set(currentUserDealershipIds));
      setSearch("");
      setSearchQuery("");
    }
  }, [open, user, currentUserDealershipIds.join(",")]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search.trim());
  };

  const toggleDealership = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(dealerships.map((d) => d.id)));
    else setSelectedIds(new Set());
  };

  const handleSave = async () => {
    if (!user) return;
    await onAssign(user.id, Array.from(selectedIds));
    onSuccess();
    onOpenChange(false);
  };

  const allSelected = dealerships.length > 0 && dealerships.every((d) => selectedIds.has(d.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Assign to Dealership
          </DialogTitle>
        </DialogHeader>
        {user && (
          <p className="text-sm text-muted-foreground">
            Assign dealerships for <span className="font-medium text-foreground">{user.name}</span>. You can select multiple.
          </p>
        )}

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search dealerships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <div className="border rounded-md overflow-hidden flex-1 min-h-[200px] max-h-[320px] flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1 p-6">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {dealerships.length > 0 && (
                <div className="p-2 border-b bg-muted/50 flex items-center gap-2">
                  <Checkbox
                    id="select-all-dealers"
                    checked={allSelected}
                    onCheckedChange={(c) => handleSelectAll(c === true)}
                  />
                  <label htmlFor="select-all-dealers" className="text-xs font-medium cursor-pointer">
                    Select all ({dealerships.length})
                  </label>
                </div>
              )}
              <ul className="overflow-y-auto flex-1 p-2">
                {dealerships.length === 0 ? (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    {searchQuery ? "No dealerships match your search." : "No dealerships found."}
                  </li>
                ) : (
                  dealerships.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center gap-2 py-2 px-2 rounded hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleDealership(d.id)}
                    >
                      <Checkbox
                        checked={selectedIds.has(d.id)}
                        onCheckedChange={() => toggleDealership(d.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm truncate flex-1">{d.name}</span>
                      {d.city && d.state && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {d.city}, {d.state}
                        </span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save ({selectedIds.size} selected)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
