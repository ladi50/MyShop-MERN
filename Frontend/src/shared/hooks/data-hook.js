import { useCallback, useState } from "react";

export const useData = () => {
  const [inputsData, setInputsData] = useState({
    title: "",
    description: "",
    price: ""
  });

  const dataHandler = useCallback((input) => {
    let inputName = input.name;

    setInputsData((prevInputs) => {
      return {
        ...prevInputs,
        [inputName]: input.value
      };
    });
  }, []);

  return { dataHandler, inputsData };
};
