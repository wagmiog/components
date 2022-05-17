import React, { useContext, HTMLProps, useCallback } from 'react';
import styled, { DefaultTheme, ThemeProvider as StyledComponentsThemeProvider, ThemeContext, css } from 'styled-components';
import { Colors } from './styled';
import { useIsBetaUI } from 'src/hooks/useLocation'
import ReactGA from 'react-ga'
import { Text, TextProps } from 'rebass'

const StyledLink = styled.a<{ isBeta: boolean }>`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary1)};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (acc, sizeKey) => {
    acc[sizeKey] = (a: any, b: any, c: any) => css`
      @media (max-width: ${MEDIA_WIDTHS[sizeKey]}px) {
        ${css(a, b, c)}
      }
    `;
    return acc;
  },
  {},
) as any;

const white = '#FFFFFF';
const black = '#000000';

const philippineYellow = '#FFC800'; //primary
const mustardYellow = '#E1AA00';

const eerieBlack = '#1C1C1C';
const ghostWhite = '#F7F8FA';
const ghostWhite1 = '#FAF9FD';
const chineseBlack = '#111111';
const darkGunmetal = '#212427';
const platinum = '#E5E5E5';
const darkSilver = '#717171';
const venetianRed = '#CC1512';
const oceanBlue = '#18C145';
const quickSilver = '#A3A3A3';

export const defaultColors: Colors = {
  // base
  white,
  black,

  // text
  text1: '#000000',
  text2: '#565A69',
  text3: '#888D9B',
  text4: '#C3C5CB',
  text5: '#EDEEF2',
  text6: '#EDEEF2',
  text7: '#000000',
  text8: '#565A69',
  text9: '#000000',
  text10: '#000000',
  text11: '#18C145',
  text12: '#E84142',
  text13: '#000000',
  text14: '#000000',
  text15: '#000000',

  // backgrounds / greys
  bg1: '#FFFFFF',
  bg2: '#F7F8FA',
  bg3: '#EDEEF2',
  bg4: '#CED0D9',
  bg5: '#888D9B',
  bg6: '#FFFFFF',
  bg7: '#FFFFFF',
  bg8: '#FFFFFF',
  bg9: '#000000',

  //specialty colors
  modalBG: 'rgba(0,0,0,0.3)',
  advancedBG: 'rgba(255,255,255,0.6)',

  //primary colors
  primary1: '#FF6B00',
  primary2: '#FF6B00',
  primary3: '#FF6B00',
  primary4: '#FF6B00',
  primary5: '#FF6B00',
  primary6: '#FFFFFF',

  // color text
  primaryText1: '#ffffff',

  // secondary colors
  secondary1: '#ff007a',
  secondary2: '#F6DDE8',
  secondary3: '#FDEAF1',

  // other
  red1: '#FF6871',
  red2: '#F82D3A',
  green1: '#27AE60',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  blue1: '#2172E5',

  avaxRed: '#E84142',

  switch: {
    onColor: philippineYellow,
    offColor: '#CED0D9',
    backgroundColor: platinum,
  },

  toggleButton: {
    backgroundColor: platinum,
    selectedColor: ghostWhite,
    fontColor: chineseBlack,
  },

  button: {
    primary: {
      background: philippineYellow,
      color: black,
    },
    secondary: {
      background: chineseBlack,
      color: white,
    },
    outline: {
      borderColor: philippineYellow,
      color: black,
    },
    plain: {
      color: black,
    },
    disable: {
      background: platinum,
      color: darkSilver,
    },
    confirmed: {
      background: oceanBlue,
      color: oceanBlue,
      borderColor: oceanBlue,
    },
  },

  primary: philippineYellow,
  mustardYellow,
  eerieBlack,
  ghostWhite,
  ghostWhite1,
  chineseBlack,
  darkGunmetal,
  platinum,
  darkSilver,
  venetianRed,
  oceanBlue,
  quickSilver,

  color2: ghostWhite,
  color3: platinum,
  color4: chineseBlack,
  color5: white,
  color6: chineseBlack,
  color7: ghostWhite,
  color8: platinum,
  color9: quickSilver,
};

export const defaultTheme: DefaultTheme = {
  ...defaultColors,

  grids: {
    sm: 8,
    md: 12,
    lg: 24,
  },

  //shadows
  shadow1: '#2F80ED',

  // media queries
  mediaWidth: mediaWidthTemplates,

  // css snippets
  flexColumnNoWrap: css`
    display: flex;
    flex-flow: column nowrap;
  `,
  flexRowNoWrap: css`
    display: flex;
    flex-flow: row nowrap;
  `,
};

type ThemeProviderProps = {
  children: React.ReactNode;
  theme: DefaultTheme;
};

export default function ThemeProvider({ children, theme }: ThemeProviderProps) {
  return <StyledComponentsThemeProvider theme={theme || defaultTheme}>{children}</StyledComponentsThemeProvider>;
}

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw Error('useTheme is used outside of ThemeContext');
  }

  return theme;
};


export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
  const isBeta = useIsBetaUI()

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
        ReactGA.outboundLink({ label: href }, () => {
          console.debug('Fired outbound link event', href)
        })
      } else {
        event.preventDefault()
        // send a ReactGA event and then trigger a location change
        ReactGA.outboundLink({ label: href }, () => {
          window.location.href = href
        })
      }
    },
    [href, target]
  )
  return <StyledLink target={target} rel={rel} href={href} onClick={handleClick} {...rest} isBeta={isBeta} />
}

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean; isBeta?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ theme, disabled, isBeta }) => (disabled ? theme.text2 : isBeta ? theme.primary : theme.primary1)};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :active {
    text-decoration: none;
  }
`

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}