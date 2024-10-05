import React from "react";

export type ComponentWithChildrenProps = {
    children: React.ReactNode
}

export type LanguageDict = 'en' | 'fr';

export type Language = {
    id: string;
    name: string;
    locale: LanguageDict;
    messages?: object;
}

export type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V? P: never]: any
}
