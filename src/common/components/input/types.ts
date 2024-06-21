export type InputProps<T extends unknown = string> = {
    id: string;
    value?: T;
    placeholder?: string;
    onChange: (value: T) => void;
    hidden?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
};
