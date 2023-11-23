'use server';

import { API_URL_SERVER } from '@/constants/api';
import { Endpoint, GetRecordsByPageParams } from '@/types/serverSideRequest';
import { getToken } from '@/utlis/getToken';

export const getRecordsByPageAction = async (
  endpoint: Endpoint,
  params: GetRecordsByPageParams
) => {
  const jwt = getToken();

  let url = `${API_URL_SERVER}/${endpoint}?page=${params.page}`;

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url += `&${key}=${value}`;
    }
  }
  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch`);
  }
  return res.json();
};

export const getRecordByIdAction = async (endpoint: Endpoint, id: string) => {
  const jwt = getToken();

  const res = await fetch(`${API_URL_SERVER}/${endpoint}/${id}`, {
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
};