import { ActionIcon, Box, Button, Checkbox, Grid, Group, Loader, NumberInput, Stack, Text, TextInput, Textarea } from "@mantine/core";
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
type OptionalJob = { job?: Job }

const JobForm = (props: OptionalJob) => {
  const { job = undefined } = props;

  const ctx = api.useContext();
  const { mutate: createJob } = api.job.create.useMutation({
    onSuccess: () => {
      form.reset();
      void ctx.job.all.invalidate();
    }
  });
  const { mutate: updateJob } = api.job.update.useMutation({
    onSuccess: () => {
      form.reset();
      void ctx.job.all.invalidate();
    }
  })


  const createSchema = z.object({
    name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    rate: z.number().min(0.00, { message: 'You must be at least 18 to create an account' }),
    hours: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    streetAddress: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    city: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    province: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    description: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    organizationId: z.string().min(2, { message: 'Name should have at least 2 letters' })
  });

  const updateSchema = z.object({
    name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    rate: z.number().min(0.00, { message: 'You must be at least 18 to create an account' }),
    hours: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    description: z.string().min(2, { message: 'Name should have at least 2 letters' }),
    id: z.string().min(2, { message: 'Name should have at least 2 letters' })
  });

  const validator = typeof job === "undefined" ? createSchema : updateSchema

  const form = useForm({
    initialValues: {
      name: '',
      rate: 0.00,
      hours: '',
      streetAddress: '',
      city: '',
      province: '',
      description: '',
      organizationId: 'clh23mm1a0002kulsj366ct3r'
    },
    validate: zodResolver(validator)
  });

  useEffect(() => {
    if (job) {
      //todo Figure out how to handle decimals
      const parsedJob = { ...job, rate: parseFloat(job.rate.toString()) }
      form.setValues(parsedJob);
      form.resetDirty(parsedJob);
    }
  }, [])


  const submitFunc = (values: any) => {
    if (typeof job !== "undefined") {
      updateJob({ id: job.id, name: values.name, rate: values.rate, hours: values.hours, description: values.description });
    }
    else {
      createJob(values);
    }

    closeAllModals();
  }

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit(values => submitFunc(values))}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Job Post Name"
          {...form.getInputProps('name')}
        />

        <NumberInput
          placeholder="0.00"
          label="Rate"
          precision={2}
          step={.25}
          withAsterisk
          hideControls
          {...form.getInputProps('rate')}
        />

        <TextInput
          withAsterisk
          label="Hours"
          placeholder="Job Hours"
          {...form.getInputProps('hours')}
        />

        <TextInput
          withAsterisk
          label="Address"
          placeholder="Job Location Address"
          {...form.getInputProps('streetAddress')}
        />

        <TextInput
          withAsterisk
          label="City"
          placeholder="Job Location City"
          {...form.getInputProps('city')}
        />

        <TextInput
          withAsterisk
          label="Province"
          placeholder="Job Location Province"
          {...form.getInputProps('province')}
        />

        <Textarea
          placeholder="Job Description"
          label="Description"
          withAsterisk
          {...form.getInputProps('description')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}





const JobPage: NextPage = () => {

  const ctx = api.useContext();
  const { data, isLoading } = api.job.all.useQuery();
  const deleteJobMutation = api.job.delete.useMutation({
    onSettled: () => void ctx.job.all.invalidate()
  });

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

  const jobModal = (props: OptionalJob) => {
    const { job = undefined } = props;
    openModal({
      title: "Update Job",
      size: "lg",
      children: <JobForm job={job} />
    })
  }

  return (
    <>
      <Head>
        <title>Jobs</title>
      </Head>

      <Grid align="center" mb="md">
        <Grid.Col span={4} sm={1}>
          <Button fullWidth onClick={() => jobModal({ job: undefined })}>Add Job</Button>
        </Grid.Col>
        <Grid.Col span={8} sm={8}>
          <TextInput
            sx={{ flexBasis: '60%' }}
            placeholder="Search employees..."
            icon={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col xs={10} sm={3}>
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
            {
              accessor: 'actions',
              title: <Text mr="xs">Row actions</Text>,
              textAlignment: 'right',
              render: (job: Job) => (
                <Group spacing={4} position="right" noWrap>
                  <ActionIcon
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      jobModal({ job });
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteJobMutation.mutate(job.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
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
    </>
  );
};

export default JobPage;