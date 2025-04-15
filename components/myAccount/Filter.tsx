/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
interface filterDataProps {
  filterOfAccounts: {
    id: number,
    title: string,
    logo: any,
  }[]
  setSelectOpt: (section: string) => void
  selectOpt: string,

}

const Filter = ({ filterOfAccounts, selectOpt, setSelectOpt }: filterDataProps) => {

  return (
    <div>
      <h3 className=" pl-4 py-4 text-xl">Navigation</h3>
      <ul className=" flex flex-col gap-5 font-plusSans ">
        {filterOfAccounts.map((item) => (
          <li key={item.id} onClick={() => setSelectOpt(item.title)}
            className={`flex items-center pl-4 gap-2 py-2 cursor-pointer transition-all duration-300 ${item.title === selectOpt ? "bg-[#F5EBFA] border-l-[#3E2FE1] border-l-4 " : "bg-transparent"
              }`}>
            <span className="text-[1rem]">{item.logo}</span>
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Filter;
