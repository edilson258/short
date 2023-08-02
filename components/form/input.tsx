import { ComponentProps, Dispatch, SetStateAction } from "react";

type IFormInput = ComponentProps<"input"> & {
  hasLabel?: boolean;
  labelName?: string;
  labelClassName?: string;
  setValue: Dispatch<SetStateAction<string|null>>;
};

export default function FormInput(props: IFormInput) {
  return (
    <>
      {props.hasLabel && (
        <label
          className={props.labelClassName}
          htmlFor={props.id}
        >
          {props.labelName}
        </label>
      )}
      <input
        onChange={(e) => props.setValue(e.target.value)}
        className={props.className}
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        name={props.name}
        autoFocus={props.autoFocus}
      />
    </>
  );
}
