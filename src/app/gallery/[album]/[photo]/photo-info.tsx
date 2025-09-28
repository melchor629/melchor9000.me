import {
  Box,
  Container,
  Link as MuiLink,
  Typography,
} from '@mui/material'
import type { Asset } from '@/clients/gallery'
import LabelledTypography from '@/components/labelled-typography'

export default function PhotoInfo({ photo }: { readonly photo: Asset }) {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>{photo.title || photo.id}</Typography>
      {photo.description && (
        <Typography variant="subtitle1" gutterBottom>
          {photo.description}
        </Typography>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          rowGap: 2,
          columnGap: 1,
          mt: 2,
        }}
      >
        <LabelledTypography label="Taken at" size="large">
          {photo.createdAt.toLocaleString('en', {
            dateStyle: 'full',
            timeStyle: 'medium',
          })}
        </LabelledTypography>
        {photo.location && (
          <LabelledTypography label="Location" size="large">
            <MuiLink
              href={`https://www.google.es/maps/@${photo.location.latitude},${photo.location.longitude},15z?q=${photo.location.latitude},${photo.location.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              {photo.location.city}
              ,&nbsp;
              {photo.location.state}
              &nbsp;-&nbsp;
              {photo.location.country}
            </MuiLink>
          </LabelledTypography>
        )}
        <LabelledTypography label="Camera" size="large">
          {photo.exif!.cameraMaker}
          &nbsp;
          {photo.exif!.cameraModel}
        </LabelledTypography>
        {photo.exif?.exposure && (
          <LabelledTypography label="Exposure" size="large">
            {photo.exif.exposure}
          </LabelledTypography>
        )}
        {photo.exif?.aperture && (
          <LabelledTypography label="Aperture" size="large">
            {photo.exif.aperture}
          </LabelledTypography>
        )}
        {photo.exif?.iso && (
          <LabelledTypography label="ISO" size="large">
            {photo.exif.iso}
          </LabelledTypography>
        )}
        {photo.exif?.focalLength && (
          <LabelledTypography label="Focal Length" size="large">
            {photo.exif.focalLength}
          </LabelledTypography>
        )}
        {photo.exif?.flash && (
          <LabelledTypography label="Flash" size="large">
            {photo.exif.flash}
          </LabelledTypography>
        )}
        <LabelledTypography label="Width" size="large">
          {photo.exif?.width}
        </LabelledTypography>
        <LabelledTypography label="Height" size="large">
          {photo.exif?.height}
        </LabelledTypography>
        {photo.exif?.exposureMode && (
          <LabelledTypography label="Exposure Mode" size="large">
            {photo.exif.exposureMode}
          </LabelledTypography>
        )}
        {photo.exif?.colorSpace && (
          <LabelledTypography label="Color Space" size="large">
            {photo.exif.colorSpace}
          </LabelledTypography>
        )}
      </Box>
    </Container>
  )
}
