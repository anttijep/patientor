import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { AddEntry, addPatient, setDiagnosesList, useStateValue } from "../state";
import { Diagnosis, Entry, EntryWithoutId, Patient } from "../types";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import EntryDetails from "../components/EntryDetails";
import AddEntryForm from "./addEntryForm";

const getGenderIcon = (gender: string) => {
  switch (gender) {
    case "male":
      return <MaleIcon />;
    case "female":
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  React.useEffect(() => {
    if (!Object.getOwnPropertyNames(diagnoses).length) {
      void (async () => {
        try {
          const { data: diagnosesList } = await axios.get<Diagnosis[]>(
            `${apiBaseUrl}/diagnoses`
          );
          dispatch(setDiagnosesList(diagnosesList));
        } catch (ex) {
          console.log(`Unhandled exception while updating diagnoses`);
        }
      })();
    }
  }, []);
  React.useEffect(() => {
    if (!id) {
      return;
    }
    const patient = patients[id];
    if (patient && !patient.ssn) {
      void (async () => {
        try {
          const { data: patient } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(addPatient(patient));
        } catch (ex) {
          console.log(`Unhandled exception while updating patient info`);
        }
      })();
    }
  }, [id, dispatch, patients]);

  if (!id) {
    return <div>Something went wrong...</div>;
  }
  const patient = patients[id];
  if (!patient) {
    return null;
  }

  const submitNewEntry = async (entry: EntryWithoutId) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entry
      );
      dispatch(AddEntry(newEntry, id));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
      }
    }
  };

  return (
    <div>
      <h2>
        {patient.name} {getGenderIcon(patient.gender)}
      </h2>
      {patient.ssn && <p>ssn: {patient.ssn}</p>}
      <p>occupation: {patient.occupation}</p>
      {patient.entries && (patient.entries.length || null) && <h3>entries</h3>}
      {patient.entries &&
        patient.entries.map((e) => <EntryDetails key={e.id} entry={e} />)}
      <AddEntryForm onSubmit={submitNewEntry} />
    </div>
  );
};

export default PatientInfoPage;
