import React from 'react'
import { fetchDeveloper } from '../actions';
import CreateUpdateDeveloper from '../create-developers/page';

const page = async ({ searchParams }) => {
    const { developerId } = searchParams;
    const response = await fetchDeveloper(developerId);
  
    return (
        <CreateUpdateDeveloper initialDeveloperData={response.data.result.rows[0]} updateDeveloper={true}></CreateUpdateDeveloper>
    )
}

export default page