import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import Container from '../../components/Container';
import { Loading, Owner, Filter, IssueList, Page } from './styles';

import GitHubApi from '../../services/github-api';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    issueType: 'open',
    loading: true,
    actualPage: 1,
  };

  componentDidMount() {
    this.getIssues();
  }

  async getIssues() {
    const { issueType, actualPage } = this.state;

    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      GitHubApi.get(`/repos/${repoName}`),
      GitHubApi.get(`/repos/${repoName}/issues`, {
        params: {
          state: issueType,
          per_page: 30,
          page: actualPage,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleInputChange = e => {
    this.setState({
      issueType: e.target.value,
      actualPage: 1,
    });
    this.getIssues();
  };

  handleChangePage = e => {
    const { actualPage } = this.state;
    let page = 0;
    if (e.target.id === 'prev') {
      page = actualPage > 1 ? actualPage - 1 : 1;
    } else {
      page = actualPage + 1;
    }
    this.setState({
      actualPage: page,
    });
    this.getIssues();
  };

  render() {
    const { repository, issues, issueType, loading, actualPage } = this.state;

    if (loading) {
      return <Loading>Carregando ...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <Filter>
          <div>
            <input
              type="radio"
              value="all"
              checked={issueType === 'all'}
              onChange={this.handleInputChange}
            />
            <label htmlFor="issueTypeAll">All</label>
          </div>
          <div>
            <input
              type="radio"
              value="open"
              checked={issueType === 'open'}
              onChange={this.handleInputChange}
            />
            <label htmlFor="issueTypeAll">Open</label>
          </div>
          <div>
            <input
              type="radio"
              value="closed"
              checked={issueType === 'closed'}
              onChange={this.handleInputChange}
            />
            <label htmlFor="issueTypeAll">Closed</label>
          </div>
        </Filter>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Page page={actualPage}>
          <FaChevronLeft
            id="prev"
            disabled={actualPage === 1}
            onClick={this.handleChangePage}
          />
          <span>{actualPage}</span>
          <FaChevronRight id="next" onClick={this.handleChangePage} />
        </Page>
      </Container>
    );
  }
}
