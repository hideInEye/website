export const taxonomyManagerStyles = {
  layout: "grid items-start gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]",
  createCard: "xl:sticky xl:top-24",
  cardForm: "flex flex-col gap-6",
  fullButton: "w-full",
  collection: "flex min-w-0 flex-col gap-4",
  collectionHeader: "flex flex-wrap items-end justify-between gap-3",
  collectionTitle: "font-literary text-2xl font-semibold",
  collectionDescription: "mt-1 text-sm text-muted-foreground",
  itemHeader: "flex flex-row items-start justify-between gap-4",
  itemIdentity: "min-w-0",
  itemTitle: "truncate text-base",
  itemPath: "mt-1 truncate font-mono text-xs text-muted-foreground",
  itemActions: "flex flex-wrap gap-2",
  editFooter: "flex flex-wrap justify-end gap-2",
  descriptionCount: "text-right",
  emptyIcon: "size-6"
} as const;
