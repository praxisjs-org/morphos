import type { PrimitiveProps } from "@morphos/core";

export interface AutocompleteSuggestion {
  value: string;
  label?: string;
}

export interface AutocompleteProps extends PrimitiveProps {
  suggestions: AutocompleteSuggestion[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  filterFn?: (suggestion: AutocompleteSuggestion, query: string) => boolean;
  onValueChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: AutocompleteSuggestion) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
