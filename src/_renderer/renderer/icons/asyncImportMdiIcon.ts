export const importIconByName = async (name: string) => {
    const module = await import(`@mdi/js`);
    return (module as any)[name];
  };
  