import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  GlobalHeader,
  Layout,
  Logo,
  useLayout,
} from '@newrelic/gatsby-theme-newrelic';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import MobileHeader from '../components/MobileHeader';
import { useMedia } from 'react-use';
import Seo from '../components/seo';
import RootNavigation from '../components/RootNavigation';
import SubNavigation from '../components/SubNavigation';
import { animated, useTransition } from 'react-spring';
import { useLocation } from '@reach/router';

const MainLayout = ({ data = {}, children, pageContext }) => {
  const { nav, rootNav } = data;
  const { contentPadding } = useLayout();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isSmallScreen = useMedia('(max-width: 760px)');

  const transition = useTransition(nav, {
    key: nav?.id,
    config: { mass: 1, friction: 34, tension: 400 },
    initial: { position: 'absolute' },
    from: (nav) => ({
      opacity: 0,
      position: 'absolute',
      transform: `translateX(${nav?.id === rootNav.id ? '125px' : '-125px'})`,
    }),

    enter: { opacity: 1, transform: 'translateX(0)' },
    leave: (nav) => ({
      opacity: 0,
      transform: `translateX(${nav?.id === rootNav.id ? '125px' : '-125px'})`,
    }),
  });

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <>
      <Seo />
      <GlobalHeader />
      {isSmallScreen && (
        <MobileHeader
          isOpen={isMobileNavOpen}
          onToggle={() => setIsMobileNavOpen((open) => !open)}
          css={css`
            padding: ${contentPadding};
            padding-bottom: 0;
          `}
        >
          {nav.id === rootNav.id ? (
            <RootNavigation nav={rootNav} />
          ) : (
            <SubNavigation nav={nav} />
          )}
        </MobileHeader>
      )}
      <Layout>
        <Layout.Sidebar>
          <Link
            to="/"
            css={css`
              display: block;
              margin-bottom: 1rem;
            `}
          >
            <Logo />
          </Link>
          {transition((style, nav) => {
            const containerStyle = css`
              left: ${contentPadding};
              right: ${contentPadding};
              top: calc(${contentPadding} + 3rem);
              padding-bottom: ${contentPadding};
            `;

            return nav?.id === rootNav.id ? (
              <animated.div style={style} css={containerStyle}>
                <RootNavigation nav={nav} />
              </animated.div>
            ) : (
              <animated.div style={style} css={containerStyle}>
                <SubNavigation nav={nav} />
              </animated.div>
            );
          })}
        </Layout.Sidebar>
        <Layout.Main
          css={css`
            display: ${isMobileNavOpen ? 'none' : 'block'};
          `}
        >
          {children}
        </Layout.Main>
        <Layout.Footer fileRelativePath={pageContext.fileRelativePath} />
      </Layout>
    </>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  pageContext: PropTypes.object,
};

export const query = graphql`
  fragment MainLayout_query on Query {
    rootNav: nav(slug: "/") {
      id
    }
    nav(slug: $slug) {
      id
      title(locale: $locale)
      pages {
        ...MainLayout_navPages
        pages {
          ...MainLayout_navPages
          pages {
            ...MainLayout_navPages
            pages {
              ...MainLayout_navPages
              pages {
                ...MainLayout_navPages
              }
            }
          }
        }
      }
    }
  }

  fragment MainLayout_navPages on NavItem {
    title(locale: $locale)
    url
    icon
  }
`;

export default MainLayout;
