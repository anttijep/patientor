import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSES_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      payload: {entry: Entry, patientId: string};
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "SET_DIAGNOSES_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
        },
      };
      case "ADD_ENTRY":
        const patient = state.patients[action.payload.patientId];
        patient.entries = patient.entries.concat(action.payload.entry);
        return {
          ...state,
          patients: {
            ...state.patients,
            [patient.id]: patient
          }
        };
    default:
      return state;
  }
};

export const setPatientList = (list: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: list };
};

export const addPatient = (patient: Patient): Action => {
  return {type: "ADD_PATIENT", payload: patient};
};

export const setDiagnosesList = (list: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSES_LIST", payload: list};
};

export const AddEntry = (entry: Entry, patientId: string): Action => {
  return { type: "ADD_ENTRY", payload: {entry, patientId}};
};
