import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import DataArray from '@mui/icons-material/DataArray'
import Error from '@mui/icons-material/Error'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import FontWeightValues from '../utils/fontTypes'

export interface Props {
  open: boolean
  onClose: () => void
}

function InformationModal(props: Props) {
  const { onClose, open } = props

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        도움말
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText fontWeight={FontWeightValues.BOLD} lineHeight={2}>
          사용법
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          1. <b>Config</b>에서 공고 날짜 범위, 필드를 선택해줍니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          2. <b>Platforms</b>에서 원하는 플랫폼의 우측 토글 버튼을 눌러 선택해줍니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          3. 각 플랫폼 블럭을 클릭하여 설정을 여닫을 수 있습니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          4. <b>추가하기</b> 버튼을 클릭하여 원하는 직무를 모두 선택해줍니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          5. 우측 <b>Result</b>에 추가된 플랫폼과 직무를 확인합니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          6. <b>START</b>를 클릭 하여 크롤링을 진행합니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          7. 각 직무 chip을 클릭시 직무별 csv를, 아래 다운 버튼 클릭시 플랫폼 단위로 다운로드
          가능합니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          8. 크롤링 도중, <b>STOP</b>을 클릭하여 크롤링을 중지할 수 있습니다.
        </DialogContentText>

        <DialogContentText fontWeight={FontWeightValues.BOLD} lineHeight={2} mt={3}>
          인디케이터
        </DialogContentText>
        <Grid container spacing={1}>
          <Grid item>
            <Chip label="크롤링 시작 전" variant="outlined" />
          </Grid>
          <Grid item>
            <Chip
              label="결과가 있을 경우 (29)"
              variant="outlined"
              icon={<Check fontSize="small" color="primary" />}
            />
          </Grid>
          <Grid item>
            <Chip
              label="크롤링 도중인 경우"
              variant="outlined"
              icon={<CircularProgress size={20} sx={{ p: 0.5 }} />}
            />
          </Grid>
          <Grid item>
            <Chip
              label="문제가 발생했을 경우 / 중단시"
              variant="outlined"
              icon={<Error fontSize="small" color="error" />}
            />
          </Grid>

          <Grid item>
            <Chip
              label="결과가 없을 경우"
              variant="outlined"
              icon={<DataArray fontSize="small" color="disabled" />}
            />
          </Grid>
        </Grid>

        <DialogContentText fontWeight={FontWeightValues.BOLD} lineHeight={2} mt={3}>
          예외 케이스
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          - 크롤링 중 결과가 없거나 문제 발생시 직무 chip에 에러 인디케이터가 표시됩니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          - <b>원티드</b>의 경우, 공고 날짜가 지원되지 않아 전체 공고 크롤링을 진행합니다.
        </DialogContentText>
        <DialogContentText lineHeight={2}>
          - 모든 요청은 기존적으로 병렬로 이루어지되, 서버 과부하 방지를 위해 3개 초과 카테고리는{' '}
          <b>동기 요청</b>이 이루어집니다. 따라서 크롤링 속도가 느릴 수 있습니다.
        </DialogContentText>
        <Divider sx={{ my: 2 }} />
        <DialogContentText variant="body2" lineHeight={2} textAlign="center">
          created by. <b>kyungbae@publy.co</b>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default InformationModal
