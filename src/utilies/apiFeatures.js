



//  class ApiFeatures {

//     constructor(queryData, mongooseQuery) {

//         this.mongooseQuery = mongooseQuery;
//         this.queryData = queryData
//     }

//     pagination() {

//         let { size, page } = this.queryData
//         if (!size || size < 0) {
//             size = 1
//         }
//         if (!page || page < 0) {
//             page = 1
//         }

//         this.mongooseQuery.limit(parseInt(size)).skip(parseInt(page - 1) * parseInt(size))
//         return this
//     }


//     filter() {
//         const excludedQueries = ["sort", "fields", "select", "search", "size", "page"]

//         const filterQuery = { ...this.queryData }

//         excludedQueries.forEach(query => {
//             delete filterQuery[query]
//         })

//         this.mongooseQuery.find(JSON.parse(JSON.stringify(filterQuery).replace(/(lt|lte|lt|lte|eq|neq|in|nin)/g, match => `$${match}`)))

//         return this
//     }

//     sort() {
// if(this.queryData.sort){
//         this.mongooseQuery.sort(this.queryData?.sort?.split(",").join(" "))
//         return this}
//     }
//     fields() {
//         if(this.queryData.fields){

//         this.mongooseQuery.select(this.queryData.fields.split(",").join(" "))
//         return this}
//     }

//     seacrch() {
//         this.mongooseQuery.find({
//             $or: [
//                 { name: { $regex: this.queryData?.search, $option: "i" } },
//                 { description: { $regex: this.queryData?.search, $option: "i" } }
//             ]
//         })

//         return this
//     }


// }



// export default ApiFeatures


class ApiFeatures {
    constructor(queryData, mongooseQuery) {
      this.mongooseQuery = mongooseQuery;
      this.queryData = queryData;
    }
  
    pagination() {
      let { size, page } = this.queryData;
      if (!size || size < 0) {
        size = 1;
      }
      if (!page || page < 0) {
        page = 1;
      }
      this.page=page
  
      this.mongooseQuery.limit(parseInt(size)).skip(parseInt(page - 1) * parseInt(size));
      return this;
    }
  
    filter() {
      const excludedQueries = ["sort", "fields", "select", "search", "size", "page"];
  
      const filterQuery = { ...this.queryData };
  
      excludedQueries.forEach((query) => {
        delete filterQuery[query];
      });
  
      this.mongooseQuery.find(
        JSON.parse(
          JSON.stringify(filterQuery).replace(/(lt|lte|lt|lte|eq|neq|in|nin)/g, (match) => `$${match}`)
        )
      );
  
      return this;
    }
  
    sort() {
      
        this.mongooseQuery.sort(this.queryData?.sort?.split(",").join(" "));
      
      return this;
    }
  
    fields() {
      
        this.mongooseQuery.select(this.queryData?.fields?.split(",").join(" "));
      
      return this;
    }
  
    seacrch() {
        if(this.queryData?.search){
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.search, $options: "i" } },
          { description: { $regex: this.queryData.search, $options: "i" } },
        ],
      })}
  
      return this;
    }
  }
  
  export default ApiFeatures;