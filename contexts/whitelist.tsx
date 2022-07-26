import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface WhitelistContextProps {
  whitelist: string[];
  blacklist: string[];
}

const defaultContext: WhitelistContextProps = {
  whitelist: [],
  blacklist: [],
};

export const WhitelistContext = createContext<WhitelistContextProps>(defaultContext);

const fetchSheet = (list: "white" | "black") =>
  fetch(`/api/sheet?list=${list}`, {
    headers: { "Content-Type": "application/json" },
  });

export const WhitelistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [whitelist, setWhitelist] = useState(defaultContext.whitelist);
  const [blacklist, setBlacklist] = useState(defaultContext.blacklist);

  const fetchWhitelist = async () => {
    // const response = await fetchSheet("white");
    // const result = await response.json();
    const whiteList = {
      code: 200,
      wallets: [
        "F1v6trCq1aPW5s5aG8SCaMb3LTd31Z9sUNjHy6nDi14Y",
        "GZFD2MFs6oFnEA6eUsEyXhXyRPY3822ciaYsi7eUCAwE",
        "9LcP6HLZrDfsYuVSR3SkziLo98Dm9gXRnLLdUTMAFRGb",
        "7PvqP27WFtvRfJZwoUFgCJDGRcqD9h8Y35Gu1zYeGmVZ",
        "9eq7R21tFxYgf1dhDjvcFsgkYbMc3nWTPxjBPtg68JCp",
        "GQywo1NKTnVtqngt1GMiYYzdpdJwfki1tXWWwjNhDs1t",
        "5ZNuXTV6dp1bog3DHcSxDvnwk21x5cMfchAQWTPu6uiJ",
        "5YaseoBXZhSik7Jhqxjqf4Z7fyvsSg1jRifuP8HW6zyv",
        "3xTRhsG8ERs7NwKNWVTockvWHQSLD4dASxGpQyqjEbBG",
        "4wFrjjvTYbrGekZAPMFsrTbBSP27rd8fVC3NtQ5jKSqS",
      ],
    };
    setWhitelist(whiteList.wallets);
  };

  const fetchBlacklist = async () => {
    // const response = await fetchSheet("black");
    // const result = await response.json();
    const blackList = { code: 200, wallets: ["5CWBPvG9xpRCHe59hxu37s9omZxQDTiqMT419WugyaxW"] };
    setBlacklist(blackList.wallets);
  };

  useEffect(() => {
    fetchWhitelist();
    fetchBlacklist();
  }, []);

  return (
    <WhitelistContext.Provider
      value={{
        whitelist,
        blacklist,
      }}
    >
      {children}
    </WhitelistContext.Provider>
  );
};

export const useWhitelist = (): WhitelistContextProps => {
  const context = useContext(WhitelistContext);
  if (context === undefined) {
    throw new Error("useWhitelist must be used within a WhitelistProvider");
  }
  return context;
};
