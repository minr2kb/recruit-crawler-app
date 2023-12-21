/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useAtom } from 'jotai'
import { headerFields } from '../utils/const'
import { limitMonthsState, selectedFieldsState } from '../utils/store'

function ConfigSection() {
  const [selectedFields, setSelectedFields] = useAtom(selectedFieldsState)
  const [limitMonths, setLimitMonths] = useAtom(limitMonthsState)

  const handleCheckboxChange = (key: string, label: string) => {
    setSelectedFields((prev) => {
      if (prev.map((field) => field.key).includes(key)) {
        return prev.filter((p) => p.key !== key)
      }
      return [...prev, { key, label }]
    })
  }

  return (
    <Box display="flex" flexDirection="column" pt={3}>
      <TextField
        type="number"
        label="크롤링 범위 (개월)"
        value={limitMonths}
        onChange={(e) => {
          const val = Number(e.target.value)
          setLimitMonths(val)
        }}
        onBlur={() => {
          setLimitMonths(Math.max(limitMonths, 1))
        }}
        sx={{ mb: 2 }}
      />
      {Object.entries(headerFields).map(([key, label]) => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={selectedFields.map((field) => field.key).includes(key)}
              onChange={() => {
                handleCheckboxChange(key, label)
              }}
            />
          }
          label={`${label} (${key})`}
        />
      ))}
    </Box>
  )
}

export default ConfigSection
