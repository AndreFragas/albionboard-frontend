import Box from '@mui/material/Box'
import { LayoutProps } from 'src/@core/layouts/types'
import themeConfig from 'src/configs/themeConfig'
import HorizontalNavItems from './HorizontalNavItems'

interface Props {
  settings: LayoutProps['settings']
  horizontalNavItems: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['navMenu']>['navItems']
}

const Navigation = (props: Props) => {
  return (
    <Box
      className='menu-content'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '& > *': {
          '&:not(:last-child)': { mr: 1 },
          ...(themeConfig.menuTextTruncate && { maxWidth: 200 })
        }
      }}
    >
      <HorizontalNavItems {...props} />
    </Box>
  )
}

export default Navigation
