import { ActionIcon, Box, Button, Checkbox, Container, Grid, Group, Loader, NumberInput, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { useForm, zodResolver } from '@mantine/form';
import { z } from "zod";
import { closeAllModals, openModal } from "@mantine/modals";

type Job = RouterOutputs["job"]["all"][number];

const JobPage: NextPage = () => {

  const ctx = api.useContext();
  const { data, isLoading } = api.job.all.useQuery();

  const [records, setRecords] = useState(data);
  const [hoursFilter, setHoursFilter] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);

  useEffect(() => {
    setRecords(
      data?.filter(({ name, description, organization, hours }: Job) => {
        if (hoursFilter.length > 0 && !hoursFilter.includes(hours.toLowerCase())) {
          return false;
        }
        if (
          debouncedQuery !== '' &&
          !`${name} ${description} ${organization.name}`
            .toLowerCase()
            .includes(debouncedQuery.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );
  }, [debouncedQuery, hoursFilter, data]);

  return (
    <Container size='lg' p="md">
      <Head>
        <title>Jobs</title>
      </Head>

      <Grid align="center" mb="md">
        <Grid.Col span={8} sm={8}>
          <TextInput
            sx={{ flexBasis: '60%' }}
            placeholder="Search employees..."
            icon={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col xs={4} sm={4}>
          <Checkbox.Group value={hoursFilter} onChange={setHoursFilter}>
            <Group mt="xs">
              <Checkbox value="full time" label="Fulltime" />
              <Checkbox value="part time" label="Parttime" />
              <Checkbox value="hourly" label="Hourly" />
            </Group>
          </Checkbox.Group>
        </Grid.Col>
      </Grid>
      <Box sx={{ height: 300 }}>
        <DataTable
          withBorder
          borderRadius="md"
          shadow="sm"
          highlightOnHover
          columns={[
            { accessor: 'name' },
            { accessor: 'organization.name', title: 'Business' },
            { accessor: 'hours' },
            { accessor: 'city' },
          ]}
          records={records}
          fetching={isLoading}
          rowExpansion={{
            content: ({ record }: { record: Job }) => (
              <Stack p="xs" spacing={6}>
                <Group spacing={6}>
                  <Text >Rate:</Text>
                  <Text>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(parseFloat(record.rate.toString()))}</Text>
                </Group>
                <Group spacing={6}>
                  <Text >Description:</Text>
                  <Text italic>“{record.description}”</Text>
                </Group>
                <Group spacing={6}>
                  <Text >Address:</Text>
                  <Text>
                    {record.streetAddress}, {record.city}, {record.province}
                  </Text>
                </Group>
              </Stack>
            ),
          }}
        />
      </Box>
    </Container>
  );
};

export default JobPage;