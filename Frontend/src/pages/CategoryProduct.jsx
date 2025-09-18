import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import VerticalCard from '../components/VerticalCard'
import productCategory from '../helpers/productCategory'
import SummaryApi from '../common'

const CategoryProduct = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // URL se initial selected category
  const urlSearch = new URLSearchParams(location.search)
  const urlCategoryListinArray = urlSearch.getAll("category")
  const urlCategoryListObject = {}
  urlCategoryListinArray.forEach(el => { urlCategoryListObject[el] = true })

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
  const [filterCategoryList, setFilterCategoryList] = useState([])
  const [sortBy, setSortBy] = useState("")

  // Mobile filter & sort toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobileSortOpen, setMobileSortOpen] = useState(false)

  // Fetch filtered products from backend
  const fetchData = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ category: filterCategoryList })
    })
    const dataResponse = await response.json()
    setData(dataResponse?.data || [])
    setLoading(false)
  }

  // Handle checkbox selection
  const handleSelectCategory = (e) => {
    const { value, checked } = e.target
    setSelectCategory(prev => ({ ...prev, [value]: checked }))
  }

  // Update filter list & URL when checkbox changes
  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).filter(key => selectCategory[key])
    setFilterCategoryList(arrayOfCategory)

    const urlFormat = arrayOfCategory.map(el => `category=${el}`).join("&&")
    navigate("/product-category?" + urlFormat)
  }, [selectCategory])

  // Fetch products when filter changes
  useEffect(() => {
    fetchData()
  }, [filterCategoryList])

  // Handle sorting
  useEffect(() => {
    if (sortBy === "asc") setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice))
    if (sortBy === "dsc") setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice))
  }, [sortBy])

  return (
    <div className='container mx-auto p-4'>

      {/** MOBILE FILTER + SORT */}
      <div className="lg:hidden mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {/* Filter Button */}
          <button
            className="flex-1 min-w-[120px] px-4 py-2 bg-gray-200 rounded"
            onClick={() => {
              setMobileFilterOpen(prev => !prev)
              if (!mobileFilterOpen) setMobileSortOpen(false)
            }}
          >
            {mobileFilterOpen ? "Close Filters" : "Open Filters"}
          </button>

          {/* Sort Button */}
          <button
            className="flex-1 min-w-[120px] px-4 py-2 bg-gray-200 rounded"
            onClick={() => {
              setMobileSortOpen(prev => !prev)
              if (!mobileSortOpen) setMobileFilterOpen(false)
            }}
          >
            {mobileSortOpen ? "Close Sort" : "Sort by"}
          </button>
        </div>

        {/** FILTER OPTIONS */}
        {mobileFilterOpen && (
          <div className="bg-white p-4 rounded shadow mb-2">
            {productCategory.map(cat => (
              <div className="flex items-center gap-3" key={cat.value}>
                <input
                  type="checkbox"
                  checked={selectCategory[cat.value] || false}
                  value={cat.value}
                  id={cat.value}
                  onChange={handleSelectCategory}
                />
                <label htmlFor={cat.value}>{cat.label}</label>
              </div>
            ))}
          </div>
        )}

        {/** SORT OPTIONS AS BUTTONS */}
        {mobileSortOpen && (
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-col gap-2">
              <button
                className={`px-4 py-2 rounded ${sortBy === "asc" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                onClick={() => setSortBy("asc")}
              >
                Price - Low to High
              </button>
              <button
                className={`px-4 py-2 rounded ${sortBy === "dsc" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                onClick={() => setSortBy("dsc")}
              >
                Price - High to Low
              </button>
              <button
                className={`px-4 py-2 rounded ${sortBy === "" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                onClick={() => setSortBy("")}
              >
                Default
              </button>
            </div>
          </div>
        )}
      </div>

      {/** DESKTOP VERSION */}
      <div className='hidden lg:grid grid-cols-[200px,1fr]'>
        <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
          <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
          <form className='text-sm flex flex-col gap-2 py-2'>
            <div className='flex items-center gap-3'>
              <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={() => setSortBy('asc')} />
              <label>Price - Low to High</label>
            </div>
            <div className='flex items-center gap-3'>
              <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={() => setSortBy('dsc')} />
              <label>Price - High to Low</label>
            </div>
          </form>

          <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
          <form className='text-sm flex flex-col gap-2 py-2'>
            {productCategory.map(categoryName => (
              <div className='flex items-center gap-3' key={categoryName.value}>
                <input
                  type='checkbox'
                  checked={selectCategory[categoryName.value] || false}
                  value={categoryName.value}
                  id={categoryName.value}
                  onChange={handleSelectCategory}
                />
                <label htmlFor={categoryName.value}>{categoryName.label}</label>
              </div>
            ))}
          </form>
        </div>

        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>Search Results: {data.length}</p>
          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {data.length !== 0 && <VerticalCard data={data} loading={loading} />}
          </div>
        </div>
      </div>

      {/** MOBILE PRODUCTS LIST */}
      <div className='lg:hidden'>
        <p className='font-medium text-slate-800 text-lg mb-2'>Search Results: {data.length}</p>
        <VerticalCard data={data} loading={loading} />
      </div>
    </div>
  )
}

export default CategoryProduct
