import {
  Cross2Icon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ListOption from "./ListOption";
import "./index.css";

export interface IProps<T> {
  data: T[];
  value?: T | null;
  valueChange?: (value: T | null) => void;
  getOptionLabel?: (value: T) => string;
  getOptionKey?: (value: T) => string | number;
  placeholder?: string;
  styleContainer?: string | undefined;
  styleInput?: string | undefined;
  keyLabel: keyof T;
}

function AutoComplete<T>(props: IProps<T>) {
  const {
    data,
    value,
    valueChange = () => {},
    getOptionLabel,
    getOptionKey,
    placeholder,
    styleContainer = "",
    styleInput = "",
    keyLabel,
  } = props;
  const [isShowData, setShowData] = useState(false);
  const refInput = useRef<HTMLInputElement | null>(null);
  const refDiv = useRef<HTMLDivElement | null>(null);
  const handleDefaultTitle = useCallback(() => {
    if (getOptionLabel && value) {
      return getOptionLabel(value);
    }
    return (value ? value?.[keyLabel] : "") as string;
  }, [getOptionLabel, keyLabel, value]);
  const [valueText, setValueText] = useState(handleDefaultTitle());
  const onFocus = () => {
    if (!isShowData) {
      setShowData(true);
    }
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      refDiv.current &&
      event?.target instanceof Node &&
      !refDiv.current?.contains(event?.target)
    ) {
      setShowData(false);
    }
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueText(event?.target?.value);
  };
  const onClear = () => {
    setValueText("");
    valueChange(null);
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [refDiv]);
  const onClickItem = (item: T) => {
    valueChange(item);
    setShowData(false);
  };
  useEffect(() => {
    if (value) {
      setValueText(handleDefaultTitle());
    }
  }, [getOptionLabel, handleDefaultTitle, value]);
  return (
    <div className={`container ${styleContainer}`} aria-hidden ref={refDiv}>
      <div className={`input ${styleInput}`} onClick={onFocus} aria-hidden>
        <input
          onFocus={onFocus}
          ref={refInput}
          value={valueText}
          placeholder={placeholder || "Select the country"}
          autoCapitalize="off"
          autoCorrect="off"
          onClick={onFocus}
          autoComplete="off"
          onChange={onChangeText}
        />
        {valueText ? <Cross2Icon onClick={onClear} className="icon" /> : null}
        {isShowData ? (
          <TriangleUpIcon width={20} height={20} className="icon" />
        ) : (
          <TriangleDownIcon width={20} height={20} className="icon" />
        )}
      </div>
      {isShowData ? (
        <ListOption
          data={data}
          searchValue={valueText}
          getOptionKey={getOptionKey}
          getOptionLabel={getOptionLabel}
          onClick={onClickItem}
          keyLabel={keyLabel}
        />
      ) : null}
    </div>
  );
}

export default AutoComplete;
