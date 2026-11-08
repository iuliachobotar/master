import {
    SimpleForm,
    Edit,
    TextInput,
    ReferenceInput,
    BooleanInput,
    SelectInput,
    required,
} from "react-admin";
import { MediaInput } from "@/app/admin/mediaInput";

export const ChallengeOptionEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput
                    source="text"
                    label="Text"
                    parse={(v: string) => v ?? ""}
                    helperText="Для FLIP — слово іноземною мовою (лицьова сторона картки). Можна лишити порожнім."
                />

                <BooleanInput
                    source="correct"
                    label="Correct option"
                    helperText="SELECT/ASSIST: правильна відповідь. TYPE: увімкнено — це треба набрати, вимкнено — показати як уже написане. FLIP: можна лишити увімкненим."
                />

                <ReferenceInput
                    source="challengeId"
                    reference="challenges"
                >
                    <SelectInput
                        optionText="question"
                        validate={[required()]}
                        label="Challenge"
                    />
                </ReferenceInput>

                <TextInput
                    source="translation"
                    label="Translation (для FLIP)"
                    helperText="Український переклад на звороті фліп-картки. Для інших типів лишити порожнім."
                />

                <MediaInput source="imageSrc" label="Image" kind="image" />
                <MediaInput source="audioSrc" label="Audio" kind="audio" />
            </SimpleForm>
        </Edit>
    );
};