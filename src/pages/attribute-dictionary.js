import React, { memo, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { graphql, Link } from 'gatsby';
import {
  Button,
  Callout,
  ContributingGuidelines,
  Layout,
  Tag,
  TagList,
  useQueryParams,
  Icon,
} from '@newrelic/gatsby-theme-newrelic';

import SEO from '../components/seo';
import DataDictionaryFilter from '../components/DataDictionaryFilter';
import PageTitle from '../components/PageTitle';
import Table from '../components/Table';

import { useMedia } from 'react-use';

const AttributeDictionary = ({ data, pageContext }) => {
  const { allDataDictionaryEvent } = data;
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { queryParams } = useQueryParams();

  const isMobileScreen = useMedia('(max-width: 1240)');

  const events = useMemo(
    () => allDataDictionaryEvent.edges.map((edge) => edge.node),
    [allDataDictionaryEvent]
  );

  const filterEvents = () => {
    let filteredEvents = events;

    if (queryParams.has('dataSource')) {
      filteredEvents = filteredEvents.filter((event) =>
        event.dataSources.includes(queryParams.get('dataSource'))
      );
    }

    if (queryParams.has('event')) {
      filteredEvents = filteredEvents.filter(
        (event) => event.name === queryParams.get('event')
      );
    }

    setFilteredEvents(filteredEvents.map((event) => event.name));
  };

  useEffect(() => {
    filterEvents();
  }, [queryParams, events]);

  return (
    <>
      <SEO title="New Relic data dictionary" />
      <div
        css={css`
          display: grid;
          grid-template-areas:
            'page-title page-title'
            'page-description page-tools'
            'content page-tools';
          grid-template-columns: minmax(0, 1fr) 320px;
          grid-column-gap: 2rem;
          @media (max-width: 1240px) {
            grid-template-areas:
              'page-title'
              'page-description'
              'page-tools'
              'content';
            grid-template-columns: minmax(0, 1fr);
          }
        `}
      >
        <PageTitle>New Relic data dictionary</PageTitle>
        <div
          css={css`
            grid-area: 'page-description';
          `}
        >
          <p
            css={css`
              color: var(--secondary-text-color);
              font-size: 1.125rem;
            `}
          >
            This data dictionary lists and defines the{' '}
            <Link to="/docs/using-new-relic/welcome-new-relic/getting-started/glossary#attribute">
              attributes
            </Link>{' '}
            attached to New Relic events and other data objects (like Metric and
            Span data).
          </p>
          <Callout variant={Callout.VARIANT.TIP}>
            This dictionary does not contain data reported by Infrastructure
            integrations. To learn about that data, see the{' '}
            <Link to="/docs/integrations">integration documentation</Link>.
          </Callout>

          <hr />
        </div>
        <Layout.Content>
          <div
            css={css`
              display: none;
              position: sticky;
              top: var(--global-header-height);
              font-size: 0.875rem;
              background: var(--primary-background-color);
              padding: 2rem 0;
            `}
          >
            Displaying {filteredEvents.length} of {events.length} results{' '}
            {filteredEvents.length !== events.length && (
              <Button as={Link} to="?" variant={Button.VARIANT.LINK}>
                Clear
              </Button>
            )}
          </div>

          {events.map((event) => (
            <div
              key={event.name}
              className={filteredEvents.includes(event.name) ? '' : 'hidden'}
              css={css`
                &.hidden {
                  display: none;
                }
              `}
            >
              <EventDefinition
                event={event}
                filteredAttribute={queryParams.get('attribute')}
              />
            </div>
          ))}
        </Layout.Content>
        <Layout.PageTools
          css={css`
            background-color: var(--primary-background-color);
            @media (max-width: 1240px) {
              position: static;
            }
          `}
        >
          {!isMobileScreen && (
            <ContributingGuidelines
              fileRelativePath={pageContext.fileRelativePath}
            />
          )}
          <DataDictionaryFilter events={events} />
        </Layout.PageTools>
      </div>
    </>
  );
};

AttributeDictionary.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};

const pluralize = (word, count) => (count === 1 ? word : `${word}s`);

const EventDefinition = memo(({ event, filteredAttribute }) => {
  const filteredAttributes = filteredAttribute
    ? event.childrenDataDictionaryAttribute.filter(
        (attribute) => attribute.name === filteredAttribute
      )
    : event.childrenDataDictionaryAttribute;

  return (
    <div
      key={event.name}
      css={css`
        &:not(:last-child) {
          margin-bottom: 2rem;
        }
      `}
    >
      <Link to={`?event=${event.name}`}>
        <h2
          as={Link}
          css={css`
            position: sticky;
            top: var(--global-header-height);
            background: var(--primary-background-color);
            padding: 1rem 0;

            // cover up the right table border
            margin-right: -1px;

            &:hover svg {
              opacity: 1;
            }

            @media (max-width: 1240px) {
              position: static;
            }
          `}
        >
          <code
            css={css`
              background: none !important;
            `}
          >
            {event.name}
          </code>
          <Icon
            name="fe-link-2"
            focusable={false}
            css={css`
              margin-left: 0.5rem;
              opacity: 0;
              transition: opacity 0.2s ease-out;
            `}
          />
        </h2>
      </Link>
      <div
        css={css`
          margin-bottom: 1rem;
        `}
      >
        <span
          css={css`
            font-size: 0.75rem;
            margin-right: 0.5rem;
          `}
        >
          Data {pluralize('source', event.dataSources.length)}
        </span>
        <TagList>
          {event.dataSources.map((dataSource) => (
            <Tag as={Link} to={`?dataSource=${dataSource}`} key={dataSource}>
              {dataSource}
            </Tag>
          ))}
        </TagList>
      </div>
      <div dangerouslySetInnerHTML={{ __html: event.definition?.html }} />
      <Table>
        <thead>
          <tr>
            <th
              css={css`
                white-space: nowrap;
              `}
            >
              Attribute name
            </th>
            <th>Definition</th>
            <th>Events</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttributes.map((attribute) => {
            const params = new URLSearchParams();
            params.set('dataSource', event.dataSources[0]);
            params.set('event', event.name);
            params.set('attribute', attribute.name);

            return (
              <tr>
                <td
                  css={css`
                    width: 40%;
                    word-break: break-all;
                  `}
                >
                  <Link
                    to={`?${params.toString()}`}
                    css={css`
                      color: var(--color-text-primary);

                      &:hover svg {
                        opacity: 1;
                      }
                    `}
                  >
                    <code
                      css={css`
                        display: inline-block;
                        background: none !important;
                      `}
                    >
                      {attribute.name}
                    </code>
                    <Icon
                      name="fe-link-2"
                      size="1rem"
                      focusable={false}
                      css={css`
                        margin-left: 0.5rem;
                        opacity: 0;
                        transition: opacity 0.2s ease-out;
                      `}
                    />
                  </Link>
                  {attribute.units && (
                    <div
                      css={css`
                        font-size: 0.75rem;

                        .dark-mode & {
                          color: var(--color-dark-600);
                        }
                      `}
                    >
                      {attribute.units}
                    </div>
                  )}
                </td>
                <td
                  css={css`
                    p:last-child {
                      margin-bottom: 0;
                    }
                  `}
                  dangerouslySetInnerHTML={{
                    __html: attribute.definition.html,
                  }}
                />
                <td
                  css={css`
                    width: 1px;
                  `}
                >
                  <ul
                    css={css`
                      margin: 0;
                      list-style: none;
                      padding-left: 0;
                      font-size: 0.875rem;
                    `}
                  >
                    {attribute.events.map((event) => (
                      <li key={event.name}>
                        <Link to={`?event=${event.name}`}>{event.name}</Link>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
});

EventDefinition.propTypes = {
  event: PropTypes.object.isRequired,
  filteredAttribute: PropTypes.string,
};

export const pageQuery = graphql`
  query {
    allDataDictionaryEvent(sort: { fields: [name] }) {
      edges {
        node {
          name
          dataSources
          definition {
            html
          }
          childrenDataDictionaryAttribute {
            name
            units
            definition {
              html
            }
            events {
              name
            }
          }
          ...DataDictionaryFilter_events
        }
      }
    }
  }
`;

export default AttributeDictionary;
