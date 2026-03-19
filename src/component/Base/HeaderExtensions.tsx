import * as React from "react";
import { createPortal } from "react-dom";

// Глобальный контекст для хранения ссылки на элемент заголовка
export const HeaderContext = React.createContext<React.RefObject<HTMLDivElement> | null>(null);

// Главный компонент для обработки ссылок на DOM-элементы
export function HeaderExtensions({ children }: React.PropsWithChildren) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Предоставляем ссылку на элемент через контекст */}
      <HeaderContext.Provider value={ref}>{children}</HeaderContext.Provider>
      <div ref={ref}></div>
    </>
  );
}

// Элемент для размещения контента в указанном месте (через портал)
export function HeaderExtension({ children }: React.PropsWithChildren) {
  const contextRef = React.useContext(HeaderContext); // Извлекаем рефер из контекста

  if (!contextRef || !contextRef.current) return null; // Проверяем существование рефера

  return createPortal(children, contextRef.current); // Портал для переноса контента
}
