import { Button, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Formik, Form, Field, FormikErrors } from "formik";
import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { EntryWithoutId, HealthCheckRating } from "../types";
import React from "react";

interface EntryProps {
  onSubmit: (value: EntryWithoutId) => void;
}

type entryTypes = "Hospital" | "HealthCheck" | "OccupationalHealthcare";

interface TypeSelections {
  value: entryTypes;
  label: string;
}

const typeOptions: TypeSelections[] = [
  { value: "HealthCheck", label: "Health check" },
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "Occupational healthcare" },
];

interface SpecialFieldsProps {
  type: entryTypes;
  rating: HealthCheckRating;
  discharge: { date: string; criteria: string };
  employerName: string;
  sickLeave: { startDate: string; endDate: string };
  onChange: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => void;
}

interface HealthCheckSelections {
  value: HealthCheckRating;
  label: string;
}

const HealthCheckOptions: HealthCheckSelections[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low risk" },
  { value: HealthCheckRating.HighRisk, label: "High risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical risk" },
];

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const SpecialFields = ({
  type,
  onChange,
  rating,
  discharge,
  employerName,
  sickLeave,
}: SpecialFieldsProps) => {
  switch (type) {
    case "HealthCheck":
      return (
        <>
          <InputLabel>Health rating</InputLabel>
          <Select
            value={rating}
            onChange={onChange}
            fullWidth
            name="healthCheckRating"
          >
            {HealthCheckOptions.map((o) => {
              return (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              );
            })}
          </Select>
        </>
      );
    case "Hospital":
      return (
        <>
          <Field
            name="discharge.date"
            onChange={onChange}
            label="Discharge date"
            placeholder="YYYY-MM-DD"
            value={discharge.date}
            component={TextField}
          />
          <Field
            name="discharge.criteria"
            onChange={onChange}
            label="Discharge criteria"
            value={discharge.criteria}
            component={TextField}
          />
        </>
      );
    case "OccupationalHealthcare":
      return (
        <>
          <Field
            name="employerName"
            onChange={onChange}
            label="Employer name"
            value={employerName}
            component={TextField}
          />
          <Field
            name="sickLeave.startDate"
            onChange={onChange}
            label="Sick leave start date"
            value={sickLeave.startDate}
            placeholder="YYYY-MM-DD"
            component={TextField}
          />
          <Field
            name="sickLeave.endDate"
            onChange={onChange}
            label="Sick leave end date"
            value={sickLeave.endDate}
            placeholder="YYYY-MM-DD"
            component={TextField}
          />
        </>
      );
    default:
      return null;
  }
};

const AddEntryForm = ({ onSubmit }: EntryProps) => {
  const [{ diagnoses }] = useStateValue();
  const initialValues = {
    type: typeOptions[0].value,
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    discharge: { date: "", criteria: "" },
    employerName: "",
    sickLeave: { startDate: "", endDate: "" },
    healthCheckRating: HealthCheckRating.Healthy,
  };
  return (
    <div>
      <h2>Add entry</h2>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const requiredError = "Field is required";
          const notDate = "Field has to be 'valid' date";
          const errors: FormikErrors<typeof initialValues> = {};
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.date) {
            errors.date = requiredError;
          }
          else if (!isDate(values.date)) {
            errors.date = notDate;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          switch (values.type) {
            case "Hospital":
              if (!values.discharge.date) {
                errors.discharge = {};
                errors.discharge.date = requiredError;
              }
              else if (!isDate(values.discharge.date)) {
                errors.discharge = {};
                errors.discharge.date = notDate;
              }
              if (!values.discharge.criteria) {
                if (!errors.discharge) {
                  errors.discharge = {};
                }
                errors.discharge.criteria = requiredError;
              }
              break;
            case "HealthCheck":
              if (values.healthCheckRating === undefined) {
                errors.healthCheckRating = requiredError;
              }
              break;
            case "OccupationalHealthcare":
              if (!values.employerName) {
                errors.employerName = requiredError;
              }
              break;
            default:
              errors.type = requiredError;
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ isValid, dirty, values, setFieldValue, setFieldTouched }) => {
          return (
            <Form className="form ui">
              <InputLabel>Type</InputLabel>
              <Select
                fullWidth
                name="type"
                onChange={(e) => setFieldValue("type", e.target.value)}
                value={values.type}
              >
                {typeOptions.map((to) => (
                  <MenuItem key={to.value} value={to.value}>
                    {to.label}
                  </MenuItem>
                ))}
              </Select>
              <Field
                label="Description"
                name="description"
                placeholder="Description"
                component={TextField}
              />
              <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
              />
              <Field
                label="Specialist"
                name="specialist"
                placeholder="Specialist"
                component={TextField}
              />

              <SpecialFields
                onChange={(e) => {
                  if (e.target.name) {
                    setFieldValue(e.target.name, e.target.value);
                  } else {
                    console.debug(e);
                  }
                }}
                type={values.type}
                rating={values.healthCheckRating}
                discharge={values.discharge}
                employerName={values.employerName}
                sickLeave={values.sickLeave}
              />

              <DiagnosisSelection
                diagnoses={Object.values(diagnoses)}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
              <Button
                disabled={!(isValid && dirty)}
                variant="contained"
                type="submit"
              >
                submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddEntryForm;
