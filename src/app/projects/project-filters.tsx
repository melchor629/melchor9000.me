'use client'

import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material'
import { useCallback, useMemo } from 'react'
import type { ProjectEntry } from '@/content/projects/types'

export type ProjectFiltersProps = {
  readonly values: {
    sortBy: string
    showDiscontinued: boolean
    techs: ProjectEntry['technologies']
  }
  readonly onChange: <T extends keyof ProjectFiltersProps['values']>(
    name: T,
    value: ProjectFiltersProps['values'][T],
  ) => void
  readonly allTechs: ProjectEntry['technologies']
}

export default function ProjectFilters({
  allTechs,
  onChange,
  values: { showDiscontinued, sortBy, techs },
}: ProjectFiltersProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      {/* <Autocomplete
        options={allTechs}
        size="small"
        multiple
        value={techs}
        onChange={useMemo(() => (_, newValues: ProjectEntry['technologies']) => onChange('techs', newValues), [onChange])}
        renderInput={useCallback(
          (params) => <TextField {...params} label="Technologies" />,
          [],
        )}
        sx={{ flexGrow: 1, minWidth: 300 }}
      /> */}
      <FormControl
        sx={{ flexGrow: 1, minWidth: 300 }}
        size="small"
        margin="dense"
      >
        <InputLabel htmlFor="techs">Techs</InputLabel>
        <Select
          name="techs"
          multiple
          value={techs}
          label="Techs"
          onChange={useCallback(
            (e: SelectChangeEvent<ProjectEntry['technologies']>) =>
              Array.isArray(e.target.value) && onChange('techs', e.target.value),
            [onChange],
          )}
          renderValue={useCallback(
            (selected: ProjectEntry['technologies']) => (
              <Stack
                direction="row"
                sx={{
                  gap: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                  />
                ))}
              </Stack>
            ),
            [],
          )}
          MenuProps={{
            slotProps: {
              paper: {
                sx: { maxHeight: 300 },
              },
            },
          }}
        >
          {allTechs.map((tech) => (
            <MenuItem
              key={tech}
              value={tech}
              sx={{ py: 0.125 }}
            >
              <Checkbox
                checked={techs.includes(tech)}
                size="small"
              />
              <ListItemText primary={tech} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Sort By"
        name="sortBy"
        size="small"
        margin="dense"
        select
        value={sortBy}
        onChange={useMemo(() => (e) => onChange('sortBy', e.target.value), [onChange])}
        slotProps={{
          select: {
            renderValue: useCallback((value: unknown) => {
              if (value === 'name-asc') return 'Name (asc)'
              if (value === 'name-desc') return 'Name (desc)'
              if (value === 'started-asc') return 'Started (asc)'
              if (value === 'started-desc') return 'Started (desc)'
              return ''
            }, []),
          },
        }}
      >
        <MenuItem value="name-asc">
          <ListItemText
            primary="Name"
            secondary="Ascending"
          />
        </MenuItem>
        <MenuItem value="name-desc">
          <ListItemText
            primary="Name"
            secondary="Descending"
          />
        </MenuItem>
        <MenuItem value="started-asc">
          <ListItemText
            primary="Started"
            secondary="Ascending"
          />
        </MenuItem>
        <MenuItem value="started-desc">
          <ListItemText
            primary="Started"
            secondary="Descending"
          />
        </MenuItem>
      </TextField>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showDiscontinued}
            onChange={useMemo(
              () => (e) => onChange('showDiscontinued', e.target.checked),
              [onChange],
            )}
          />
        }
        label="Show discontinued"
      />
    </Box>
  )
}
