import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TickerTagInputProps {
  value: string[];
  onChange: (tickers: string[]) => void;
  label: string;
  overlappingTickers: string[];
  maxTickers?: number;
}

const TICKER_REGEX = /^[A-Z]{1,5}$/;
const ADVISORY_MESSAGE =
  "Symbol format looks valid — we'll confirm availability when your agent scans.";

export function TickerTagInput({
  value,
  onChange,
  label,
  overlappingTickers,
  maxTickers = 10,
}: TickerTagInputProps) {
  const theme = Colors[useColorScheme()];
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [dismissedAdvisories, setDismissedAdvisories] = useState<string[]>([]);
  // Which chip's advisory is currently expanded inline
  const [expandedAdvisory, setExpandedAdvisory] = useState<string | null>(null);

  const atMax = value.length >= maxTickers;

  const handleSubmit = () => {
    const normalized = inputText.trim().toUpperCase();
    if (!normalized) return;

    if (!TICKER_REGEX.test(normalized)) {
      setInputError("Ticker must be 1–5 uppercase letters");
      return;
    }

    if (value.includes(normalized)) {
      setInputError(`${normalized} is already in this list`);
      return;
    }

    onChange([...value, normalized]);
    setInputText("");
    setInputError(null);
  };

  const handleRemove = (ticker: string) => {
    onChange(value.filter((t) => t !== ticker));
    setDismissedAdvisories((prev) => prev.filter((t) => t !== ticker));
    if (expandedAdvisory === ticker) setExpandedAdvisory(null);
  };

  const handleAdvisoryToggle = (ticker: string) => {
    if (expandedAdvisory === ticker) {
      setExpandedAdvisory(null);
    } else {
      setExpandedAdvisory(ticker);
    }
  };

  const handleAdvisoryDismiss = (ticker: string) => {
    setDismissedAdvisories((prev) => [...prev, ticker]);
    setExpandedAdvisory(null);
  };

  const isOverlapping = (ticker: string) => overlappingTickers.includes(ticker);
  const hasAdvisory = (ticker: string) => !dismissedAdvisories.includes(ticker);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>

      {/* Chip + input flow */}
      <View
        style={[
          styles.inputArea,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
          },
        ]}
      >
        <View style={styles.chipWrap}>
          {value.map((ticker) => {
            const overlapping = isOverlapping(ticker);
            const advisory = hasAdvisory(ticker);
            return (
              <View
                key={ticker}
                style={[
                  styles.chip,
                  { backgroundColor: theme.surface },
                  overlapping && styles.chipOverlapping,
                ]}
              >
                <Text style={[styles.chipText, { color: theme.electricBlue }]}>
                  {ticker}
                </Text>

                {/* Advisory badge — shown if not dismissed and not overlapping */}
                {advisory && !overlapping && (
                  <TouchableOpacity
                    onPress={() => handleAdvisoryToggle(ticker)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
                    style={styles.advisoryBadge}
                  >
                    <Text style={[styles.advisoryBadgeText, { color: theme.warning }]}>
                      !
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Remove button — 44×44pt touch target via hitSlop */}
                <TouchableOpacity
                  onPress={() => handleRemove(ticker)}
                  hitSlop={{ top: 10, bottom: 10, left: 8, right: 10 }}
                  style={styles.removeButton}
                >
                  <Text style={[styles.removeText, { color: theme.textSecondary }]}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Text input — inline with chips */}
          {!atMax && (
            <TextInput
              ref={inputRef}
              style={[styles.textInput, { color: theme.textPrimary }]}
              value={inputText}
              onChangeText={(t) => {
                setInputText(t.toUpperCase());
                if (inputError) setInputError(null);
              }}
              onSubmitEditing={handleSubmit}
              placeholder="AAPL"
              placeholderTextColor={theme.textDisabled}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={5}
              blurOnSubmit={false}
            />
          )}
        </View>
      </View>

      {/* Cap reached message */}
      {atMax && (
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Maximum {maxTickers} tickers reached
        </Text>
      )}

      {/* Format validation error */}
      {inputError && (
        <Text style={[styles.errorText, { color: theme.danger }]}>
          {inputError}
        </Text>
      )}

      {/* Overlap error */}
      {value.some(isOverlapping) && (
        <Text style={[styles.errorText, { color: theme.danger }]}>
          This ticker is also in your opposing list — remove it from one to
          continue
        </Text>
      )}

      {/* Expanded advisory message */}
      {expandedAdvisory && hasAdvisory(expandedAdvisory) && (
        <View
          style={[
            styles.advisoryMessage,
            { backgroundColor: theme.surface, borderColor: theme.warning },
          ]}
        >
          <Text style={[styles.advisoryText, { color: theme.textSecondary }]}>
            {ADVISORY_MESSAGE}
          </Text>
          <TouchableOpacity
            onPress={() => handleAdvisoryDismiss(expandedAdvisory)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.advisoryDismiss, { color: theme.textDisabled }]}>
              ×
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  inputArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 48,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipOverlapping: {
    borderColor: "#D64545",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  advisoryBadge: {
    paddingHorizontal: 2,
  },
  advisoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  removeButton: {
    paddingHorizontal: 2,
  },
  removeText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 18,
  },
  textInput: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    minWidth: 60,
    height: 28,
    padding: 0,
  },
  hint: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
  },
  advisoryMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  advisoryText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  advisoryDismiss: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 18,
  },
});
