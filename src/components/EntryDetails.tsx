import { useStateValue } from "../state/state";
import { Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled type ${JSON.stringify(value)}`);
};

const HealthRatingIcon = ({rating}: {rating: HealthCheckRating}) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <FavoriteIcon style={{color: "green"}}/>;
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon style={{color: "yellow"}}/>;
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon style={{color: "orange"}}/>;
      case HealthCheckRating.CriticalRisk:
        return <FavoriteIcon style={{color: "red"}}/>;
      default:
        assertNever(rating);
  }
  console.error("Invalid healthcheckrating");
  return null;
};



const DiagnosisCodesElem: React.FC<{ list: string[] | undefined }> = ({
  list,
}) => {
  const [{ diagnoses }] = useStateValue();
  if (!list) return null;
  return (
    <ul>
      {list.map((c) => {
        const diagnosis = diagnoses[c];
        if (diagnosis) {
          return (
            <li key={diagnosis.code}>
              {diagnosis.code} {diagnosis.name}
            </li>
          );
        }
        console.error(`Unknown diagnosis code ${c}`);
        return null;
      })}
    </ul>
  );
};

const HospitalEntryElem: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div>
      <span>{entry.date} <LocalHospitalIcon/></span>
      <div>{entry.description}</div>
      <DiagnosisCodesElem list={entry.diagnosisCodes} />
      <div>Discharge: {entry.discharge.date} - {entry.discharge.criteria}</div>
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};


const HealthCheckEntryElem: React.FC<{ entry: HealthCheckEntry }> = ({
  entry,
}) => {
  return (
    <div>
      <span>{entry.date} <MedicalServicesIcon/></span>
      <div>{entry.description}</div>
      <DiagnosisCodesElem list={entry.diagnosisCodes} />
      <HealthRatingIcon rating={entry.healthCheckRating}/>
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};

const OccupationalHealthcareElem: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <div>
      <span>{entry.date} <WorkIcon/> {entry.employerName}</span>
      <div>{entry.description}</div>
      <DiagnosisCodesElem list={entry.diagnosisCodes} />
      {entry.sickLeave && (
        <div>Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</div>
      )}
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};

const style : React.CSSProperties = {
  borderRadius: 12,
  border: "0.1em solid",
  padding: "1em",
  marginBottom: "1em"
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <div style={style}><HospitalEntryElem entry={entry} /></div>;
    case "HealthCheck":
      return <div style={style}><HealthCheckEntryElem entry={entry} /></div>;
    case "OccupationalHealthcare":
      return <div style={style}><OccupationalHealthcareElem entry={entry} /></div>;
    default:
      assertNever(entry);
  }
  console.error("invalid entry");
  return null;
};


export default EntryDetails;
