import React, { ChangeEvent, FC, useContext, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Layout } from "../../components/layouts";
import {
  capitalize,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  IconButton,
} from "@mui/material";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Entry, EntryStatus } from "../../interfaces";
import { isValidObjectId } from "mongoose";
import { dbEntries } from "../../database";
import { EntriesContext } from "../../context/entries";
import { getFormatDistanceFromNow } from "../../utils/dateFunctions";

const validStatus: EntryStatus[] = ["pending", "in-progress", "finished"];

interface Props {
  entry: Entry;
}

const EntryPage: FC<Props> = ({ entry }) => {
  const { updateEntry, deleteEntry, refreshEntries } =
    useContext(EntriesContext);
  const router = useRouter();
  const [inputValue, setInputValue] = useState(entry.description);
  const [status, setStatus] = useState<EntryStatus>(entry.status);
  const [touched, setTouched] = useState(false);

  const isNotValid = useMemo(
    () => inputValue.length <= 0 && touched,
    [inputValue, touched]
  );

  const onTextFieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onStatusChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as EntryStatus);
  };

  const onSave = () => {
    if (inputValue.trim().length === 0) return;

    const updatedEntry: Entry = {
      ...entry,
      status,
      description: inputValue,
    };

    updateEntry(updatedEntry, true);
    router.push("/");
  };

  const onDelete = () => {
    deleteEntry(entry._id, true);
    router.push("/");
  };

  return (
    <Layout title={inputValue.substring(0, 10) + "..."}>
      <Grid container justifyContent='center' sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader
              title={`Entry: ${inputValue}`}
              subheader={`Created: ${getFormatDistanceFromNow(
                entry.createdAt
              )}`}
            />
            <CardContent>
              <TextField
                sx={{ marginTop: 2, marginBottom: 1 }}
                fullWidth
                placeholder='New Entry | Nueva entrada'
                autoFocus
                multiline
                label='New Entry | Nueva entrada'
                value={inputValue}
                onBlur={() => setTouched(true)}
                onChange={onTextFieldChanged}
                helperText={isNotValid && "Enter a value"}
                error={isNotValid && touched}
              />

              <FormControl>
                <FormLabel>Estado</FormLabel>

                <RadioGroup row value={status} onChange={onStatusChanged}>
                  {validStatus.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={capitalize(option)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<SaveOutlinedIcon />}
                variant='contained'
                fullWidth
                onClick={onSave}
                disabled={inputValue.length <= 0}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <IconButton
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          backgroundColor: "error.dark",
        }}
        onClick={onDelete}
      >
        <DeleteForeverOutlinedIcon />
      </IconButton>
    </Layout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };

  // al hacer request de la ruta /entries/entryId checkeamos si el id es valido,
  // si no lo es entonces no renderizo el componente del front y redirijo al usuario al index

  const entry = await dbEntries.getEntryById(id);

  if (!entry) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      entry,
    },
  };
};

export default EntryPage;
