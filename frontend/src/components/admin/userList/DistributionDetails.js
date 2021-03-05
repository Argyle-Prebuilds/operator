import {capitalize, CircularProgress, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import JSONPretty from 'react-json-pretty';
import Pagination from '@material-ui/lab/Pagination';
import 'react-json-pretty/themes/monikai.css';
import {PAGINATION_INITIAL_STATE} from "../../../consts";
import {getDistributions} from "../../../services/AdminServices";
import {displayErrorNotifications} from "../../../utils/display-error-notifications";
import {PaperContainer} from "../common/PaperContainer";


export const DistributionDetails = () => {
  const [params, setParams] = useState(useParams())
  const [paginationConfig, setPaginationConfig] = useState(PAGINATION_INITIAL_STATE)
  const [email, setEmail] = useState('')
  const [jsonList, setJsonList] = useState([])
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDistributions = () => {
    getDistributions(params.uuid, paginationConfig).then(response => {
      let data = response.data
      setEmail(data['email'])
      setJsonList(data['allocations'])
      let pageCount = Math.ceil(data['allocations'].length / paginationConfig.itemsPerPage)
      setPaginationConfig({
        ...paginationConfig,
        pageCount: pageCount
      })
      setLoading(false);
    }).catch(error => {
      setLoading(false);
      displayErrorNotifications(error)
    })
  }

  const handlePageChange = (event, value) => {
    setPaginationConfig({
      ...paginationConfig,
      page: value
    })
  }

  const prepareContent = () => {
    if (jsonList.length) {
      let employer = '';
      let start = (paginationConfig.page - 1) * paginationConfig.itemsPerPage
      let end = (paginationConfig.page) * paginationConfig.itemsPerPage
      let listSegment = jsonList.slice(start, end)
      const content = <>
        {listSegment.map((allocation) => {
          return (
            <div key={allocation['id']}>
              {employer !== allocation['employer'] ? <Typography variant="h5">
                {capitalize(allocation['employer'])}
              </Typography> : null}
              <JSONPretty data={allocation}/>
            </div>
          )
        })}
      </>

      setContent(content)
    }
  }

  useEffect(() => fetchDistributions(), [])
  useEffect(() => prepareContent(), [paginationConfig, jsonList])

  if (loading) {
    return (
      <PaperContainer>
        <CircularProgress/>
      </PaperContainer>
    );
  }

  return (
    <PaperContainer title={`${email}'s Pay Allocations`}>
      {content === null ? (
        <Typography variant="h6" align="center"
                    className="margin-bottom-25">
          Empty list
        </Typography>
      ) : content}
      <Pagination count={paginationConfig.pageCount} onChange={handlePageChange}/>
    </PaperContainer>
  )
}
