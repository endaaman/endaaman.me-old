import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import marked from 'marked'

import NoMacth from '../404'

import Root from '../../components/root'
import Header from '../../components/header'
import Container from '../../components/container'
import Footer from '../../components/footer'

import { getMemo } from '../../actions/memo'
import { findMemo } from '../../util'

import styles from '../../styles/memo.css'

class MemoShow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      notFound: false
    }
  }
  static loadProps({ dispatch, params }) {
    return dispatch(getMemo(params.path))
  }
  componentWillMount() {
    this.constructor.loadProps(this.props)
    .then((memo)=> {
      if (!memo) {
        this.setState({
          notFound: true
        })
      }
    })
  }
  getHref() {
    const l = this.props.location
    const search = l.search
      ? '?' + l.search
      : ''
    return `${l.pathname}${search}`
  }
  dateFormat(date) {
    const _d = new Date(date)
    const y = _d.getFullYear()
    const m = _d.getMonth()
    const d = _d.getDate() + 1
    return `${y}年${m}月${d}日`
  }
  getContentHtml() {
    let html = ''
    if (this.props.memo.content) {
      html = marked(this.props.memo.content)
    }
    return {
      __html: html
    }
  }
  render() {
    const fail = <NotFound />
    const ok = (
      <div>
        <header className={styles.header}>
          <Container>
            <h1 className={styles.title}>
              <Link to={this.getHref()}>{memo.title}</Link>
            </h1>
            <div className={styles.date}>
              <span>{this.dateFormat(memo.created_at)}</span>
              <span> </span>
              { this.props.session.user
                  ? <Link to={`/memos/${memo._id}/edit`}>edit</Link>
                  : null
              }
            </div>
          </Container>
        </header>
        <Container>
          <div dangerouslySetInnerHTML={this.getContentHtml()} />
        </Container>
      </div>
    )

    return (
      <article>
        { this.props.notFound
          ? fail
          : ok
        }
      </article>
    )
  }
}

export default connect((state, ownProps) => ({
  memo: findMemo(state.memo.detail.items, ownProps.params.path) || {},
  notFound: state.memo.detail.noMatches.indexOf(ownProps.params.path) < 0,
  session: state.session,
}))(MemoShow)
