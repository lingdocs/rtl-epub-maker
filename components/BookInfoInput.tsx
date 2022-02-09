import { ChangeEvent, useState, useRef } from "react";
import Select from "react-select";

const requiredFields = [
    "title",
];

const possibleFields = [
    "date",
    "description",
    "rights",
    "belongs-to-collection",
    "author",
    "editor",
    "translator",
]

type Option = {
    value: string,
    label: string,
};

const baseSettings = {
    language: "ps-AF",  
    dir: "rtl",
    "page-progression-direction": "rtl",
};

function BookInfoInput({ handleSubmit }: { handleSubmit: (info: { frontmatter: Frontmatter, cover: File | undefined }) => void }) {
    const coverRef = useRef<any>(null);
    const [fieldsChosen, setFieldsChosen] = useState<string[]>([]);
    const [state, setState] = useState<Frontmatter>(Object.assign({}, ...requiredFields.map(f => ({ [f]: "" }))));
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
    function submit() {
        const cover = coverRef.current.files[0] as (File | undefined);
        handleSubmit({
            frontmatter: {
                ...state,
                ...baseSettings,
            },
            cover,
        });
    }
    return <div style={{ maxWidth: "500px" }}>
        <h4>Book Metadata</h4>
        <div className="my-3">
            <label htmlFor="cover-file" className="form-label">cover image <span className="text-muted">(.jpg or .png less than 5mb)</span></label>
            <input multiple={false} ref={coverRef} className="form-control" type="file" id="cover-file" accept="image/jpeg,image/png"/>
        </div>
        {fields.map((field) => (
            <div key={field} className="d-flex flex-row align-items-end mb-2">
                <div className="col-auto" style={{ width: "100%" }}>
                    <label htmlFor={field} className="form-label d-flex flex-row align-items-center">
                        {!requiredFields.includes(field) && <span className="me-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleRemoveField(field)}>
                                X
                            </button>
                        </span>}
                        <span>{field}</span>
                    </label>
                    <input onChange={handleFieldChange} type="text" className="form-control" id={field} name={field} value={state[field]} />
                </div>
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
        <button onClick={submit} type="button" className="btn btn-primary my-4">Submit</button>
    </div>
}

export default BookInfoInput;