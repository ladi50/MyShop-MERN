import "./Spinner.css";

const Spinner = (props) => (
  <div className={props.overlay && "spinner__overlay"}>
    <div className={`spinner ${props.checkout && "spinner__checkout"}`} />
  </div>
);

export default Spinner;
