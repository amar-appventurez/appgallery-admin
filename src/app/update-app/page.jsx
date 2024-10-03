import React from 'react'
import CreateUpdateApp from '../create-app/page'
import { fetchApp } from '../actions';

const page = async ({ searchParams }) => {
    const { appId } = searchParams;
    const response = await fetchApp(appId);
  
    return (
        <CreateUpdateApp initialAppData={response.data.result.rows[0]} updateApp={true}></CreateUpdateApp>
    )
}

export default page