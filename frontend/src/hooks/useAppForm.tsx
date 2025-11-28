import { createFormHook } from "@tanstack/react-form";
import {
  fieldContext,
  formContext,
} from "../components/onboarding-form/FormContext";
import {
  TextField,
  TextAreaField,
  NumberField,
  SwitchField,
  SelectField,
  MultiSelectField,
} from "../components/onboarding-form/FormFields";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextAreaField,
    NumberField,
    SwitchField,
    SelectField,
    MultiSelectField,
  },
  formComponents: {},
});
