"use client";

import { useState, useMemo, type CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";

import Button from "../../../../components/Atoms/Buttons";
import ThemeToggle from "../../../../components/Atoms/ThemeToggle";
import type { TrelloCard } from "../../../../interface/trello";
import {
  useTrelloBoardWithData,
  useUpdateTrelloCard,
  useCreateTrelloCard,
  useDeleteTrelloCard,
  useCreateTrelloList,
  useMoveTrelloCard,
} from "../../../../hooks/useTrello";

const FIELD_INPUT_CLASSES =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-card)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand-75)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-15)]";

function SortableCard({
  card,
  disableDrag,
  onOpenEdit,
  onOpenDelete,
  onOpenDetails,
}: {
  card: TrelloCard;
  disableDrag: boolean;
  onOpenEdit: (card: TrelloCard) => void;
  onOpenDelete: (card: TrelloCard) => void;
  onOpenDetails: (card: TrelloCard) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: disableDrag });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    borderLeft: "4px solid var(--semantic-azure)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-grab rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-card)] p-4 shadow-[0_20px_44px_-28px_rgba(15,23,42,0.28)] transition-all duration-150 focus-within:border-[var(--brand-60)] focus-within:shadow-[0_28px_64px_-30px_rgba(61,139,253,0.42)] hover:-translate-y-[3px] hover:border-[var(--brand-45)] hover:shadow-[0_26px_60px_-32px_rgba(15,23,42,0.32)] active:cursor-grabbing"
      onClick={() => {
        onOpenDetails(card);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight text-[var(--foreground-strong)]">
            {card.name}
          </h3>
          {card.desc && (
            <p className="mt-2 line-clamp-3 text-sm text-[var(--foreground-muted)]">
              {card.desc}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenEdit(card);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--semantic-azure)]/15 text-[var(--semantic-azure)] transition hover:bg-[var(--semantic-azure)]/25"
            aria-label="Edit card"
          >
            <i className="fa-solid fa-pen-to-square text-xs" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenDelete(card);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--semantic-crimson)]/15 text-[var(--semantic-crimson)] transition hover:bg-[var(--semantic-crimson)]/25"
            aria-label="Delete card"
          >
            <i className="fa-solid fa-trash text-xs" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {card.labels && card.labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {card.labels.map((label, index) => (
            <span
              key={`${card.id}-label-${index}`}
              className="inline-flex items-center rounded-full border border-white/50 px-3 py-0.5 text-xs font-semibold text-white/95 shadow-[0_8px_16px_-12px_rgba(15,23,42,0.35)]"
              style={{ backgroundColor: label.color || "#7c8fb3" }}
            >
              {label.name || "Label"}
            </span>
          ))}
        </div>
      )}

      {card.due && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
          <i className="fa-regular fa-calendar text-[var(--brand-90)]" aria-hidden="true"></i>
          Due {new Date(card.due).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

function DroppableList({
  listId,
  listName,
  cards,
  disableCardDrag,
  newCardListId,
  newCardName,
  onOpenDelete,
  onAddCard,
  onCreateCard,
  onCancelNewCard,
  onNewCardNameChange,
  onOpenCard,
  onOpenEdit,
}: {
  listId: string;
  listName: string;
  cards: TrelloCard[];
  disableCardDrag: boolean;
  newCardListId: string | null;
  newCardName: string;
  onOpenDelete: (card: TrelloCard) => void;
  onAddCard: (listId: string) => void;
  onCreateCard: (listId: string) => void;
  onCancelNewCard: () => void;
  onNewCardNameChange: (value: string) => void;
  onOpenCard: (card: TrelloCard) => void;
  onOpenEdit: (card: TrelloCard) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: listId,
  });

  return (
    <SortableContext
      id={listId}
      items={cards.map((card) => card.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex h-[calc(100vh-220px)] w-[22rem] shrink-0 flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-list)] p-4 shadow-[0_20px_48px_-30px_rgba(15,23,42,0.28)] backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">{listName}</h2>
            <p className="text-xs text-[var(--foreground-muted)]">
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </p>
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-15)] text-[var(--brand-100)]">
            <i className="fa-solid fa-layer-group text-xs" aria-hidden="true"></i>
          </span>
        </div>

        <div
          ref={setNodeRef}
          className={`flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-[var(--radius-sm)] border border-dashed border-transparent px-1 py-1 transition-colors ${
            isOver
              ? "border-[var(--brand-55)] bg-[var(--brand-10)]/80"
              : "bg-[var(--surface-card)]/55"
          }`}
        >
          {cards.length > 0 ? (
            cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                disableDrag={disableCardDrag}
                onOpenEdit={onOpenEdit}
                onOpenDelete={onOpenDelete}
                onOpenDetails={onOpenCard}
              />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--border-soft)] bg-[var(--surface-card)]/70 px-4 py-6 text-center text-sm text-[var(--foreground-muted)]">
              No cards yet.
            </div>
          )}

          {newCardListId === listId ? (
            <div className="space-y-3 rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-card)]/90 p-4 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.28)]">
              <input
                type="text"
                value={newCardName}
                onChange={(event) => onNewCardNameChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onCreateCard(listId);
                  }
                }}
                className={FIELD_INPUT_CLASSES}
                placeholder="Card title"
                autoFocus
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" size="sm" onClick={() => onCreateCard(listId)}>
                  Add card
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onCancelNewCard}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddCard(listId)}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--border-soft)] bg-[var(--surface-card)] px-3 py-2 text-sm font-semibold text-[var(--foreground-muted)] transition hover:border-[var(--brand-55)] hover:text-[var(--foreground)]"
            >
              <i className="fa-solid fa-plus text-xs" aria-hidden="true"></i>
              Add a card
            </button>
          )}
        </div>
      </div>
    </SortableContext>
  );
}

export default function TrelloBoardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const boardId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data, isLoading, isError, error } = useTrelloBoardWithData(boardId);
  const updateCard = useUpdateTrelloCard(boardId);
  const createCard = useCreateTrelloCard(boardId);
  const deleteCard = useDeleteTrelloCard(boardId);
  const createList = useCreateTrelloList(boardId);
  const moveCard = useMoveTrelloCard(boardId);

  const [newCardListId, setNewCardListId] = useState<string | null>(null);
  const [newCardName, setNewCardName] = useState("");
  const [newListName, setNewListName] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [activeCard, setActiveCard] = useState<TrelloCard | null>(null);
  const [modalCardId, setModalCardId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deleteModalCardId, setDeleteModalCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = data?.lists
      .flatMap((list) => list.cards || [])
      .find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    let targetListId = over.id as string;

    // If dropped on another card, find its list
    const targetCard = data?.lists
      .flatMap((list) => list.cards || [])
      .find((c) => c.id === targetListId);

    if (targetCard) {
      targetListId = targetCard.idList;
    }

    // Find the card's current list
    const currentList = data?.lists.find((list) =>
      list.cards?.some((card) => card.id === activeCardId)
    );

    if (!currentList) return;

    // If dropped on a different list
    if (currentList.id !== targetListId) {
      const toastId = toast.loading("Moving card...");
      try {
        await moveCard.mutateAsync({
          cardId: activeCardId,
          listId: targetListId,
        });
        toast.success("Card moved!", { id: toastId });
      } catch (err) {
        toast.error("Failed to move card", { id: toastId });
      }
    }
  };

  const handleUpdateCard = async (cardId: string, name: string, desc: string) => {
    const toastId = toast.loading("Updating card...");
    try {
      await updateCard.mutateAsync({
        cardId,
        updates: { name, desc },
      });
      toast.success("Card updated!", { id: toastId });
      setModalMode("view");
      setEditTitle(name);
      setEditDesc(desc);
    } catch (err) {
      toast.error("Failed to update card", { id: toastId });
    }
  };

  const handleCreateCard = async (listId: string) => {
    if (!newCardName.trim()) return;
    const toastId = toast.loading("Creating card...");
    try {
      await createCard.mutateAsync({
        listId,
        card: { name: newCardName },
      });
      toast.success("Card created!", { id: toastId });
      setNewCardName("");
      setNewCardListId(null);
    } catch (err) {
      toast.error("Failed to create card", { id: toastId });
    }
  };

  const performDeleteCard = async (cardId: string) => {
    const toastId = toast.loading("Deleting card...");
    try {
      await deleteCard.mutateAsync(cardId);
      toast.success("Card deleted!", { id: toastId });
      return true;
    } catch (err) {
      toast.error("Failed to delete card", { id: toastId });
      return false;
    }
  };

  const closeDeleteModal = () => setDeleteModalCardId(null);

  const handleOpenCardDetails = (card: TrelloCard) => {
    setDeleteModalCardId(null);
    setModalCardId(card.id);
    setModalMode("view");
    setEditTitle(card.name);
    setEditDesc(card.desc || "");
  };

  const activeModalCard = useMemo(() => {
    if (!modalCardId) return null;
    return (
      data?.lists
        .flatMap((list) => list.cards || [])
        .find((card) => card.id === modalCardId) ?? null
    );
  }, [data?.lists, modalCardId]);

  const modalDisplayTitle = activeModalCard?.name ?? editTitle;
  const modalDisplayDesc = activeModalCard?.desc ?? editDesc;

  const deleteTargetCard = useMemo(() => {
    if (!deleteModalCardId) return null;
    return (
      data?.lists
        .flatMap((list) => list.cards || [])
        .find((card) => card.id === deleteModalCardId) ?? null
    );
  }, [data?.lists, deleteModalCardId]);

  const closeModal = () => {
    setModalCardId(null);
    setModalMode("view");
    setEditTitle("");
    setEditDesc("");
  };

  const openEditMode = (card: TrelloCard) => {
    setDeleteModalCardId(null);
    setModalCardId(card.id);
    setModalMode("edit");
    setEditTitle(card.name);
    setEditDesc(card.desc || "");
  };

  const openDeleteModal = (card: TrelloCard) => {
    setDeleteModalCardId(card.id);
  };

  const handleEditFromModal = () => {
    if (!activeModalCard) return;
    setModalMode("edit");
    setEditTitle(modalDisplayTitle);
    setEditDesc(modalDisplayDesc);
  };

  const handleCancelEdit = () => {
    if (!activeModalCard) {
      closeModal();
      return;
    }
    setModalMode("view");
    setEditTitle(activeModalCard.name);
    setEditDesc(activeModalCard.desc || "");
  };

  const handleDeleteFromModal = () => {
    if (!activeModalCard) return;
    openDeleteModal(activeModalCard);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalCardId) return;
    const deleted = await performDeleteCard(deleteModalCardId);
    if (deleted) {
      if (modalCardId === deleteModalCardId) {
        closeModal();
      }
      closeDeleteModal();
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    const toastId = toast.loading("Creating list...");
    try {
      await createList.mutateAsync(newListName);
      toast.success("List created!", { id: toastId });
      setNewListName("");
      setShowNewListInput(false);
    } catch (err) {
      toast.error("Failed to create list", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--brand-30)] border-t-[var(--brand-100)]"></div>
          <p className="text-sm text-[var(--foreground-muted)]">Loading Trello board…</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-8 text-center text-[var(--foreground)]">
        <div className="flex max-w-md flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-8 py-10 shadow-[var(--shadow)]">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          </span>
          <h1 className="text-xl font-semibold">Board unavailable</h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            {error instanceof Error
              ? error.message
              : "We couldn’t load this Trello board right now. Please try refreshing or check your Trello credentials."}
          </p>
          <Button
            variant="primary"
            onClick={() => router.push("/")}
            className="mx-auto rounded-full px-5"
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { board, lists } = data;
  const interactionLocked = Boolean(modalCardId || deleteModalCardId);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/")}
              className="rounded-full px-4"
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
              Back to dashboard
            </Button>
            <h1 className="text-2xl font-semibold leading-tight text-[var(--foreground)]">
              {board.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="rounded-full" />
            <a
              href={board.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--secondary-30)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--secondary-100)] transition hover:bg-[var(--brand-15)] hover:text-[var(--brand-100)]"
            >
              Open in Trello
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden pt-4">
        <section className="flex flex-1 min-h-0 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-1 min-h-0 items-start gap-6 overflow-x-auto overflow-y-hidden px-6">
                {lists.length === 0 && (
                  <div className="flex min-h-[200px] min-w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-alt)]/70 p-10 text-center text-sm text-[var(--foreground-muted)]">
                    <i className="fa-regular fa-note-sticky text-xl text-[var(--brand-90)]" aria-hidden="true"></i>
                    <p>
                      This board doesn’t have any lists yet. Create the first list to start planning.
                    </p>
                  </div>
                )}

                {lists.map((list) => (
                  <DroppableList
                    key={list.id}
                    listId={list.id}
                    listName={list.name}
                    cards={list.cards || []}
                    disableCardDrag={interactionLocked}
                    newCardListId={newCardListId}
                    newCardName={newCardName}
                    onOpenDelete={openDeleteModal}
                    onAddCard={(listId) => {
                      setNewCardListId(listId);
                      setNewCardName("");
                    }}
                    onCreateCard={handleCreateCard}
                    onCancelNewCard={() => {
                      setNewCardListId(null);
                      setNewCardName("");
                    }}
                    onNewCardNameChange={setNewCardName}
                    onOpenCard={handleOpenCardDetails}
                    onOpenEdit={openEditMode}
                  />
                ))}

                <div className="h-[calc(100vh-220px)] w-[22rem] shrink-0">
                  {showNewListInput ? (
                    <div className="flex h-full flex-col gap-4 rounded-[var(--radius-md)] border border-dashed border-[var(--border-soft)] bg-[var(--surface-list)]/90 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]">
                      <input
                        type="text"
                        value={newListName}
                        onChange={(event) => setNewListName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleCreateList();
                          }
                        }}
                        className={FIELD_INPUT_CLASSES}
                        placeholder="List title"
                        autoFocus
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" size="sm" onClick={handleCreateList}>
                          Add list
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowNewListInput(true)}
                      className="flex h-full min-h-[180px] w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border-soft)] bg-[var(--surface-list)]/80 p-6 text-sm font-semibold text-[var(--foreground-muted)] transition hover:border-[var(--brand-55)] hover:text-[var(--foreground)]"
                    >
                      <i className="fa-solid fa-plus text-base" aria-hidden="true"></i>
                      Add a list
                    </button>
                  )}
                </div>
              </div>

            <DragOverlay>
              {activeCard ? (
                <div className="w-72 -rotate-1 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-card)] p-4 text-sm font-semibold text-[var(--foreground-strong)] shadow-[0_32px_60px_-28px_rgba(15,23,42,0.38)]">
                  {activeCard.name}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </section>
      </main>

      {modalCardId && activeModalCard ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-8"
          onClick={closeModal}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_44px_96px_-32px_rgba(15,23,42,0.48)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface-alt)] px-6 py-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                  {modalMode === "edit" ? "Edit card" : "Card details"}
                </p>
                <h2 className="text-xl font-semibold text-[var(--foreground-strong)]">
                  {modalMode === "edit" ? "Update card details" : modalDisplayTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-card)] text-[var(--foreground-muted)] transition hover:border-[var(--brand-55)] hover:text-[var(--foreground)]"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>

            {modalMode === "view" ? (
              <>
                <div className="space-y-6 overflow-y-auto px-6 py-6 text-[var(--foreground)]">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground-muted)]">Title</h3>
                    <p className="mt-1 text-base font-medium text-[var(--foreground)]">
                      {modalDisplayTitle}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground-muted)]">Description</h3>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)]">
                      {modalDisplayDesc ? modalDisplayDesc : "No description added yet."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface-alt)] px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    <i className="fa-regular fa-rectangle-list" aria-hidden="true"></i>
                    From list
                    <span className="font-semibold text-[var(--foreground-strong)]">
                      {
                        data?.lists.find((list) =>
                          list.cards?.some((card) => card.id === activeModalCard.id)
                        )?.name || "Unknown"
                      }
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" size="sm" variant="primary" onClick={handleEditFromModal}>
                      <i className="fa-solid fa-pen-to-square text-xs" aria-hidden="true"></i>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="danger" onClick={handleDeleteFromModal}>
                      <i className="fa-solid fa-trash text-xs" aria-hidden="true"></i>
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6 overflow-y-auto px-6 py-6 text-[var(--foreground)]">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--foreground-muted)]" htmlFor="edit-card-title">
                      Title
                    </label>
                    <input
                      id="edit-card-title"
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      className={`${FIELD_INPUT_CLASSES} text-base font-medium`}
                      placeholder="Enter a card title"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--foreground-muted)]" htmlFor="edit-card-desc">
                      Description
                    </label>
                    <textarea
                      id="edit-card-desc"
                      value={editDesc}
                      onChange={(event) => setEditDesc(event.target.value)}
                      className={`${FIELD_INPUT_CLASSES} min-h-[140px] resize-vertical`}
                      placeholder="Add any helpful details"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    <i className="fa-regular fa-rectangle-list" aria-hidden="true"></i>
                    Currently in
                    <span className="font-semibold text-[var(--foreground-strong)]">
                      {data?.lists.find((list) => list.id === activeModalCard.idList)?.name || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--surface-alt)] px-6 py-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={updateCard.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      if (!modalCardId) return;
                      const trimmedTitle = editTitle.trim();
                      if (!trimmedTitle) return;
                      handleUpdateCard(modalCardId, trimmedTitle, editDesc);
                    }}
                    disabled={!editTitle.trim()}
                    isLoading={updateCard.isPending}
                  >
                    <i className="fa-solid fa-floppy-disk text-xs" aria-hidden="true"></i>
                    Save changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {deleteModalCardId ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 py-8"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_48px_96px_-32px_rgba(15,23,42,0.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3 border-b border-[var(--border)] bg-[var(--surface-alt)] px-6 py-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              </span>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[var(--foreground-strong)]">
                  Delete this card?
                </h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  This action can’t be undone. The card will be removed from Trello permanently.
                </p>
              </div>
            </div>

            <div className="space-y-4 px-6 py-6 text-[var(--foreground)]">
              <div className="rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-card)]/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                  Card
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--foreground-strong)]">
                  {deleteTargetCard?.name ?? "Unknown card"}
                </p>
                {deleteTargetCard?.desc ? (
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--foreground-muted)]">
                    {deleteTargetCard.desc}
                  </p>
                ) : null}
              </div>

              {deleteTargetCard ? (
                <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                  <i className="fa-regular fa-rectangle-list" aria-hidden="true"></i>
                  Located in
                  <span className="font-semibold text-[var(--foreground-strong)]">
                    {
                      data?.lists.find((list) =>
                        list.cards?.some((card) => card.id === deleteTargetCard.id)
                      )?.name || "Unknown list"
                    }
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--surface-alt)] px-6 py-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={closeDeleteModal}
                disabled={deleteCard.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={handleConfirmDelete}
                isLoading={deleteCard.isPending}
              >
                <i className="fa-solid fa-trash text-xs" aria-hidden="true"></i>
                Delete card
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}