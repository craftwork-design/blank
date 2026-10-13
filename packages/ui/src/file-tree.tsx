"use client"

// Adapted from Magic UI "File Tree" (MIT, © Magic UI) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/file-tree.tsx
import * as React from "react"
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type FileTreeElement = {
  /** Unique within the tree; used for selection and expansion. */
  id: string
  name: React.ReactNode
  /** Present (even empty) means the element is a folder. */
  children?: FileTreeElement[]
  disabled?: boolean
}

type FileTreeContextValue = {
  selected: string | undefined
  expanded: string[]
  focused: string | undefined
  indicator: boolean
  select: (value: string) => void
  setOpen: (value: string, open: boolean) => void
  setFocused: (value: string) => void
}

const FileTreeContext = React.createContext<FileTreeContextValue | null>(null)
const FileTreeLevelContext = React.createContext(1)

const GROUP_TRANSITION = { duration: 0.2, ease: [0.22, 1, 0.36, 1] } as const

function useFileTree() {
  const context = React.useContext(FileTreeContext)
  if (!context) {
    throw new Error("FileTree parts must be used within a <FileTree />")
  }
  return context
}

function useControllableState<T>(
  prop: T | undefined,
  defaultProp: T,
  onChange?: (value: T) => void
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultProp)
  const controlled = prop !== undefined
  const value = controlled ? prop : uncontrolled
  const setValue = React.useCallback(
    (next: T) => {
      if (!controlled) setUncontrolled(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [value, setValue] as const
}

/** Tree items whose every ancestor folder is open, in document order. */
function getVisibleItems(root: HTMLElement | null) {
  if (!root) return []
  return Array.from(
    root.querySelectorAll<HTMLElement>('[role="treeitem"]')
  ).filter((item) => {
    let parent = item.parentElement?.closest<HTMLElement>('[role="treeitem"]')
    while (parent && root.contains(parent)) {
      if (parent.getAttribute("aria-expanded") !== "true") return false
      parent = parent.parentElement?.closest<HTMLElement>('[role="treeitem"]')
    }
    return true
  })
}

function renderElements(elements: FileTreeElement[]): React.ReactNode {
  return elements.map((element) =>
    element.children ? (
      <FileTreeFolder
        key={element.id}
        value={element.id}
        name={element.name}
        disabled={element.disabled}
      >
        {renderElements(element.children)}
      </FileTreeFolder>
    ) : (
      <FileTreeFile
        key={element.id}
        value={element.id}
        name={element.name}
        disabled={element.disabled}
      />
    )
  )
}

/**
 * A file tree with the WAI-ARIA tree pattern: one tab stop, arrow keys to
 * move, Right/Left to open, enter and leave folders, Home/End, and
 * type-ahead by first letter. Build it from `FileTreeFolder` and
 * `FileTreeFile`, or pass `elements` and let it render them.
 */
function FileTree({
  className,
  value,
  defaultValue,
  onValueChange,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  elements,
  indicator = true,
  onKeyDown,
  children,
  ...props
}: Omit<React.ComponentProps<"ul">, "defaultValue"> & {
  /** The selected item. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Open folders. */
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  /** Render the tree from data instead of children. */
  elements?: FileTreeElement[]
  /** Draw a guide line down each open folder. */
  indicator?: boolean
}) {
  const ref = React.useRef<HTMLUListElement>(null)
  const [selected, setSelected] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange as ((value: string | undefined) => void) | undefined
  )
  const [open, setOpenItems] = useControllableState(
    expanded,
    defaultExpanded,
    onExpandedChange
  )
  const [focused, setFocused] = React.useState(selected)
  const typeahead = React.useRef({ query: "", timer: 0 })

  // Exactly one item is tabbable. When the remembered one is hidden inside a
  // closed folder (or there is none yet), the first visible item takes over.
  React.useEffect(() => {
    const items = getVisibleItems(ref.current)
    if (items.length && !items.some((item) => item.dataset.value === focused)) {
      setFocused(items[0].dataset.value)
    }
  })

  const setOpen = React.useCallback(
    (item: string, next: boolean) => {
      if (open.includes(item) === next) return
      setOpenItems(next ? [...open, item] : open.filter((id) => id !== item))
    },
    [open, setOpenItems]
  )

  const context = React.useMemo<FileTreeContextValue>(
    () => ({
      selected,
      expanded: open,
      focused,
      indicator,
      select: setSelected,
      setOpen,
      setFocused,
    }),
    [selected, open, focused, indicator, setSelected, setOpen]
  )

  function focusItem(item: HTMLElement | undefined) {
    if (!item) return
    setFocused(item.dataset.value)
    item.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const item = event.target as HTMLElement
    if (item.getAttribute("role") !== "treeitem") return

    const items = getVisibleItems(ref.current)
    const index = items.indexOf(item)
    const id = item.dataset.value ?? ""
    const disabled = item.getAttribute("aria-disabled") === "true"
    const isFolder = item.hasAttribute("aria-expanded")
    const isOpen = item.getAttribute("aria-expanded") === "true"

    switch (event.key) {
      case "ArrowDown":
        focusItem(items[index + 1])
        break
      case "ArrowUp":
        focusItem(items[index - 1])
        break
      case "Home":
        focusItem(items[0])
        break
      case "End":
        focusItem(items[items.length - 1])
        break
      case "ArrowRight":
        if (!isFolder || disabled) break
        if (isOpen) focusItem(items[index + 1])
        else setOpen(id, true)
        break
      case "ArrowLeft":
        if (isFolder && isOpen && !disabled) setOpen(id, false)
        else
          focusItem(
            item.parentElement?.closest<HTMLElement>('[role="treeitem"]') ??
              undefined
          )
        break
      case "Enter":
      case " ":
        if (disabled) break
        setSelected(id)
        if (isFolder) setOpen(id, !isOpen)
        break
      default: {
        if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return
        const state = typeahead.current
        window.clearTimeout(state.timer)
        state.query += event.key.toLowerCase()
        state.timer = window.setTimeout(() => (state.query = ""), 500)
        const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)]
        focusItem(
          ordered.find((candidate) =>
            candidate
              .querySelector('[data-slot="file-tree-label"]')
              ?.textContent?.toLowerCase()
              .startsWith(state.query)
          )
        )
        break
      }
    }
    event.preventDefault()
  }

  return (
    <FileTreeContext.Provider value={context}>
      <ul
        role="tree"
        data-slot="file-tree"
        onKeyDown={handleKeyDown}
        className={cn("flex flex-col text-sm select-none", className)}
        {...props}
        ref={ref}
      >
        {children ?? (elements ? renderElements(elements) : null)}
      </ul>
    </FileTreeContext.Provider>
  )
}

const rowClassName = cn(
  "flex h-7 cursor-default items-center gap-1.5 rounded-md ps-[calc((var(--file-tree-level)-1)*1.25rem+0.5rem)] pe-2 text-muted-foreground transition-colors hover:bg-item-secondary hover:text-foreground",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "[[aria-selected=true]>&]:bg-item-selected [[aria-selected=true]>&]:text-foreground [[aria-selected=true]>&_[data-slot=file-tree-icon]]:text-brand",
  "[:focus-visible>&]:ring-2 [:focus-visible>&]:ring-focus-ring [:focus-visible>&]:ring-inset",
  "[[aria-disabled=true]>&]:pointer-events-none [[aria-disabled=true]>&]:opacity-50"
)

type FileTreeItemProps = Omit<React.ComponentProps<"li">, "value"> & {
  value: string
  name: React.ReactNode
  /** Replaces the default file or folder icon. */
  icon?: React.ReactNode
  disabled?: boolean
}

function useTreeItem({
  value,
  disabled,
  style,
  onFocus,
}: Pick<FileTreeItemProps, "value" | "disabled" | "style" | "onFocus">) {
  const tree = useFileTree()
  const level = React.useContext(FileTreeLevelContext)
  return {
    tree,
    level,
    itemProps: {
      role: "treeitem",
      "data-value": value,
      "aria-level": level,
      "aria-selected": tree.selected === value,
      "aria-disabled": disabled || undefined,
      tabIndex: tree.focused === value ? 0 : -1,
      style: { "--file-tree-level": level, ...style } as React.CSSProperties,
      onFocus: (event: React.FocusEvent<HTMLLIElement>) => {
        onFocus?.(event)
        if (event.target === event.currentTarget) tree.setFocused(value)
      },
    },
  }
}

function FileTreeFolder({
  className,
  value,
  name,
  icon,
  disabled,
  style,
  onFocus,
  children,
  ...props
}: FileTreeItemProps) {
  const { tree, level, itemProps } = useTreeItem({
    value,
    disabled,
    style,
    onFocus,
  })
  const reduceMotion = useReducedMotion()
  const open = tree.expanded.includes(value)

  return (
    <li
      data-slot="file-tree-folder"
      aria-expanded={open}
      className={cn("outline-none", className)}
      {...props}
      {...itemProps}
    >
      <div
        data-slot="file-tree-row"
        className={rowClassName}
        onClick={() => {
          if (disabled) return
          tree.select(value)
          tree.setOpen(value, !open)
        }}
      >
        <ChevronRightIcon
          aria-hidden
          className="size-3.5 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none [[aria-expanded=true]>div>&]:rotate-90 rtl:rotate-180"
        />
        <span data-slot="file-tree-icon" aria-hidden className="flex">
          {icon ?? (open ? <FolderOpenIcon /> : <FolderIcon />)}
        </span>
        <span data-slot="file-tree-label" className="truncate">
          {name}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.ul
            role="group"
            data-slot="file-tree-group"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : GROUP_TRANSITION}
            className="relative overflow-hidden"
          >
            {tree.indicator ? (
              <span
                aria-hidden
                data-slot="file-tree-indicator"
                className="pointer-events-none absolute inset-y-0.5 start-[calc((var(--file-tree-level)-1)*1.25rem+0.9375rem)] w-px bg-border"
              />
            ) : null}
            <FileTreeLevelContext.Provider value={level + 1}>
              {children}
            </FileTreeLevelContext.Provider>
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </li>
  )
}

function FileTreeFile({
  className,
  value,
  name,
  icon,
  disabled,
  style,
  onFocus,
  ...props
}: FileTreeItemProps) {
  const { tree, itemProps } = useTreeItem({ value, disabled, style, onFocus })

  return (
    <li
      data-slot="file-tree-file"
      className={cn("outline-none", className)}
      {...props}
      {...itemProps}
    >
      <div
        data-slot="file-tree-row"
        className={rowClassName}
        onClick={() => {
          if (!disabled) tree.select(value)
        }}
      >
        <span aria-hidden className="size-3.5 shrink-0" />
        <span data-slot="file-tree-icon" aria-hidden className="flex">
          {icon ?? <FileIcon />}
        </span>
        <span data-slot="file-tree-label" className="truncate">
          {name}
        </span>
      </div>
    </li>
  )
}

export { FileTree, FileTreeFolder, FileTreeFile, type FileTreeElement }
