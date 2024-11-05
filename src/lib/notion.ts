import { Client } from '@notionhq/client';

if (!import.meta.env.VITE_NOTION_TOKEN || !import.meta.env.VITE_NOTION_DATABASE_ID) {
  throw new Error('Missing required environment variables');
}

const notion = new Client({
  auth: import.meta.env.VITE_NOTION_TOKEN
});

const DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;

interface NotionUser {
  id: string;
  userId: number;
  name: string;
  email: string;
}

export async function getUsers(): Promise<NotionUser[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: 'UserID', direction: 'ascending' }],
    });
    
    return response.results.map((page: any) => ({
      id: page.id,
      userId: page.properties.UserID?.number || 0,
      name: page.properties.Name?.title[0]?.plain_text || '',
      email: page.properties.Email?.email || '',
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
    throw new Error('Failed to fetch users: Unknown error');
  }
}

export async function createUser(name: string, email: string) {
  try {
    const users = await getUsers();
    const nextUserId = users.length > 0 
      ? Math.max(...users.map(user => user.userId)) + 1 
      : 1;

    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: name } }],
        },
        Email: {
          email: email,
        },
        UserID: {
          number: nextUserId,
        },
      },
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error('Failed to create user: Unknown error');
  }
}