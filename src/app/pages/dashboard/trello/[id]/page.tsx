"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useTrelloBoardWithData,
  useUpdateTrelloCard,
  useCreateTrelloCard,
  useDeleteTrelloCard,
  useCreateTrelloList,
  useMoveTrelloCard,
} from "../../../../hooks/useTrello";
import Button from "../../../../components/Atoms/Buttons";
import toast from "react-hot-toast";

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  due: string | null;
  labels: Array<{ name: string; color: string }>;
  idList: string;
}

function SortableCard({
  card,
  editingCard,
  cardTitle,
  cardDesc,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  onTitleChange,
  onDescChange,
}: {
  card: TrelloCard;
  editingCard: string | null;
  cardTitle: string;
  cardDesc: string;
  onEdit: (id: string, name: string, desc: string) => void;
  onUpdate: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onTitleChange: (value: string) => void;
  onDescChange: (value: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: editingCard === card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow group cursor-grab active:cursor-grabbing"
    >
      {editingCard === card.id ? (
        <div className="space-y-2">
          <input
            type="text"
            value={cardTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
            placeholder="Card title"
          />
          <textarea
            value={cardDesc}
            onChange={(e) => onDescChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded"
            rows={2}
            placeholder="Description"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(card.id)}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 flex-1">
              {card.name}
            </h3>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(card.id, card.name, card.desc || "");
                }}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card.id);
                }}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Del
              </button>
            </div>
          </div>

          {card.desc && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-3">
              {card.desc}
            </p>
          )}

          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-xs text-white font-medium"
                  style={{ backgroundColor: label.color || "#94a3b8" }}
                >
                  {label.name || "Label"}
                </span>
              ))}
            </div>
          )}

          {card.due && (
            <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Due: {new Date(card.due).toLocaleDateString()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DroppableList({
  listId,
  listName,
  cards,
  editingCard,
  cardTitle,
  cardDesc,
  newCardListId,
  newCardName,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  onTitleChange,
  onDescChange,
  onAddCard,
  onCreateCard,
  onCancelNewCard,
  onNewCardNameChange,
}: {
  listId: string;
  listName: string;
  cards: TrelloCard[];
  editingCard: string | null;
  cardTitle: string;
  cardDesc: string;
  newCardListId: string | null;
  newCardName: string;
  onEdit: (id: string, name: string, desc: string) => void;
  onUpdate: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onTitleChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onAddCard: (listId: string) => void;
  onCreateCard: (listId: string) => void;
  onCancelNewCard: () => void;
  onNewCardNameChange: (value: string) => void;
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
      <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        {/* List Header */}
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="font-semibold text-white">{listName}</h2>
          <p className="text-xs text-white/60 mt-1">{cards.length} cards</p>
        </div>

        {/* Cards Drop Zone */}
        <div
          ref={setNodeRef}
          className={`p-3 space-y-2 min-h-[100px] max-h-[calc(100vh-350px)] overflow-y-auto transition-colors ${
            isOver ? "bg-white/10" : ""
          }`}
        >
          {cards.length > 0 ? (
            cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                editingCard={editingCard}
                cardTitle={cardTitle}
                cardDesc={cardDesc}
                onEdit={onEdit}
                onUpdate={onUpdate}
                onCancelEdit={onCancelEdit}
                onDelete={onDelete}
                onTitleChange={onTitleChange}
                onDescChange={onDescChange}
              />
            ))
          ) : (
            <p className="text-sm text-white/70 italic">No cards in this list.</p>
          )}

          {/* Add Card */}
          {newCardListId === listId ? (
            <div className="space-y-2 bg-white dark:bg-neutral-800 rounded-lg p-3">
              <input
                type="text"
                value={newCardName}
                onChange={(e) => onNewCardNameChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onCreateCard(listId)}
                className="w-full px-2 py-1 text-sm border rounded"
                placeholder="Enter card title..."
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onCreateCard(listId)}
                  className="text-xs px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
                <button
                  onClick={onCancelNewCard}
                  className="text-xs px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onAddCard(listId)}
              className="w-full text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded px-3 py-2 transition-colors"
            >
              + Add a card
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

  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [newCardListId, setNewCardListId] = useState<string | null>(null);
  const [newCardName, setNewCardName] = useState("");
  const [newListName, setNewListName] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [activeCard, setActiveCard] = useState<TrelloCard | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

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

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setOverId(null);

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

  const handleUpdateCard = async (cardId: string) => {
    const toastId = toast.loading("Updating card...");
    try {
      await updateCard.mutateAsync({
        cardId,
        updates: { name: cardTitle, desc: cardDesc },
      });
      toast.success("Card updated!", { id: toastId });
      setEditingCard(null);
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

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Delete this card?")) return;
    const toastId = toast.loading("Deleting card...");
    try {
      await deleteCard.mutateAsync(cardId);
      toast.success("Card deleted!", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete card", { id: toastId });
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Trello board...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Board Not Found</h1>
        <p className="text-white/80 mb-6">
          {error instanceof Error
            ? error.message
            : "Unable to load this Trello board."}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/pages/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const { board, lists } = data;

  return (
    <div
      className="min-h-screen"
      style={{
        background: board.prefs?.backgroundColor
          ? `linear-gradient(135deg, ${board.prefs.backgroundColor}, ${board.prefs.backgroundColor}dd)`
          : "linear-gradient(135deg, #0079bf, #026aa7)",
      }}
    >
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/pages/dashboard")}
                className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
              >
                ← Back
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">
                    {board.name}
                  </h1>
                  <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-md">
                    📋 Trello (Editable)
                  </span>
                </div>
                {board.desc && (
                  <p className="text-sm text-white/70 mt-1">{board.desc}</p>
                )}
              </div>
            </div>
            <a
              href={board.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Open in Trello
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="p-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lists.map((list) => (
              <DroppableList
                key={list.id}
                listId={list.id}
                listName={list.name}
                cards={list.cards || []}
                editingCard={editingCard}
                cardTitle={cardTitle}
                cardDesc={cardDesc}
                newCardListId={newCardListId}
                newCardName={newCardName}
                onEdit={(id, name, desc) => {
                  setEditingCard(id);
                  setCardTitle(name);
                  setCardDesc(desc);
                }}
                onUpdate={handleUpdateCard}
                onCancelEdit={() => setEditingCard(null)}
                onDelete={handleDeleteCard}
                onTitleChange={setCardTitle}
                onDescChange={setCardDesc}
                onAddCard={setNewCardListId}
                onCreateCard={handleCreateCard}
                onCancelNewCard={() => {
                  setNewCardListId(null);
                  setNewCardName("");
                }}
                onNewCardNameChange={setNewCardName}
              />
            ))}

            {/* Add List */}
            <div className="flex-shrink-0 w-80">
              {showNewListInput ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-3">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCreateList()
                    }
                    className="w-full px-3 py-2 text-sm border rounded mb-2"
                    placeholder="Enter list title..."
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateList}
                      className="text-sm px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Add List
                    </button>
                    <button
                      onClick={() => {
                        setShowNewListInput(false);
                        setNewListName("");
                      }}
                      className="text-sm px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewListInput(true)}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 p-4 text-white transition-colors"
                >
                  + Add a list
                </button>
              )}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeCard ? (
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg w-80 rotate-3 opacity-90">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                  {activeCard.name}
                </h3>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}