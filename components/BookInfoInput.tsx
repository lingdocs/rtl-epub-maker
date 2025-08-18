'use client'

import { ChangeEvent, useState, useRef } from "react";
import Select from "react-select";
import LanguageSelect from "./LanguageSelect";
import { Frontmatter } from "@/app/page";

const requiredFields = [
  "title",
];

const suggestedFields = [
  "author",
]

const otherFields = [
  "date",
  "description",
  "rights",
  "belongs-to-collection",
  "editor",
  "translator",
];

const possibleFields = [...suggestedFields, ...otherFields];

type Option = {
  value: string,
  label: string,
};

const baseSettings = {
  dir: "rtl",
  "page-progression-direction": "rtl",
};

function BookInfoInput({ handleSubmit }: { handleSubmit: (info: { frontmatter: Frontmatter, cover: File | undefined }) => void }) {
  const coverRef = useRef<any>(null);
  const [fieldsChosen, setFieldsChosen] = useState<string[]>(suggestedFields);
  const [state, setState] = useState<Frontmatter>({});
  const fields = [...requiredFields, ...fieldsChosen];
  const availableFields = possibleFields.filter(f => !fieldsChosen.includes(f));
  const availableFieldsOptions = availableFields.map((f): Option => ({
    value: f,
    label: f,
  }));
  function handleAddField(o: Option) {
    setFieldsChosen(s => [...s, o.value]);
  }
  function handleRemoveField(f: string) {
    setFieldsChosen(s => s.filter(x => x !== f));
    setState(s => {
      const newS = { ...s };
      delete newS[f];
      return newS;
    });
  }
  function handleFieldChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setState(s => ({
      ...s,
      [name]: value,
    }));
  }
  function handleLanguageChange(lang: string | null) {
    setState(s => {
      if (!lang) {
        const { lang, language, ...rest } = s;
        return rest;
      }
      return {
        ...s,
        // TODO: using both, but which is proper/necessary?
        lang,
        language: lang,
      };
    });
  }
  function submit() {
    const cover = coverRef.current.files[0] as (File | undefined);
    const frontmatter = {
      ...state,
      ...baseSettings,
    };
    handleSubmit({
      frontmatter,
      cover,
    });
  }
  return <div style={{ maxWidth: "600px" }}>
    <div className="my-3">
      <label htmlFor="cover-file" className="form-label">cover image <span className="text-muted">(.jpg or .png less than 5mb)</span></label>
      <input multiple={false} ref={coverRef} className="form-control" type="file" id="cover-file" accept="image/jpeg,image/png" />
    </div>
    {fields.map((field) => (
      <div className="mb-2" key={field}>
        <label htmlFor={field} className="form-label d-flex flex-row align-items-center">
          {!requiredFields.includes(field) && <span className="me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleRemoveField(field)}>
              X
            </button>
          </span>}
          <span>{field}</span>
        </label>
        <input onChange={handleFieldChange} type="text" className="form-control" id={field} name={field} value={state[field] || ""} />
      </div>
    ))}
    <div className="mt-4 mb-2">add fields:</div>
    <Select
      className="basic-single"
      classNamePrefix="select"
      isClearable={true}
      value={[]}
      isSearchable
      // @ts-ignore
      onChange={handleAddField}
      // @ts-ignore
      options={availableFieldsOptions}
    />
    <LanguageSelect value={state.lang} onChange={handleLanguageChange} />
    <button onClick={submit} type="button" className="btn btn-lg btn-primary my-4">Download .epub</button>
  </div>
}

export default BookInfoInput;
