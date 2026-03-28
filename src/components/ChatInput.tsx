import { FormEvent, useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/60 p-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-5xl items-end gap-3">
        <label className="sr-only" htmlFor="product-idea-input">
          Idea de producto
        </label>
        <textarea
          id="product-idea-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          placeholder="Describe tu idea de producto para analizar oportunidades en Reddit..."
          rows={2}
          className="min-h-[56px] flex-1 resize-none border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex min-h-[48px] items-center justify-center border border-cyan-300/30 bg-cyan-400/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/60 hover:bg-cyan-400/16 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35"
        >
          {disabled ? (
            <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent" />
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </form>
  );
}
