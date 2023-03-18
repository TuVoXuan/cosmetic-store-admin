// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TypographyTexts from 'src/views/typography/TypographyTexts'
import TypographyHeadings from 'src/views/typography/TypographyHeadings'
import ProtectRoute from '../../layouts/components/ProtectRoute'
import { getCookie } from 'cookies-next'

interface Props {
  auth: string
}

const TypographyPage = ({ auth }: Props) => {
  return (
    <ProtectRoute auth={auth}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TypographyHeadings />
        </Grid>
        <Grid item xs={12}>
          <TypographyTexts />
        </Grid>
      </Grid>
    </ProtectRoute>
  )
}

export const getServerSideProps = ({ req, res }: any) => {
  const auth = getCookie('Authorization', { req, res }) || ''

  return { props: { auth: auth } }
}

export default TypographyPage
