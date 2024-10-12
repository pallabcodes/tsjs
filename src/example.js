class QueryHelper {
  constructor() {
    // pagination defaults
    this.limit = limit || 10;
    this.page = currentPage || 1;

  }

  async prepareAnd(...args) {
    throw new Error("NOT IMPLEMENTED")
  }

  async prepareAnd(...args) {
    throw new Error("NOT IMPLEMENTED")
  }

  async prepareAnd() {
    throw new Error("NOT IMPLEMENTED")
  }

  async filters (...configMap) {
    if(configMap["$and"]) {
      configMap["and"] = this.prepareAnd(this.andFactory.manageAnd);
    }

    return config;
  }

  async lookup() {
    throw new Error("NOT IMPLEMENTED")
  }

  async pipeline(aggregations) {
    throw new Error("NOT IMPLEMENTED")

  }

  async executePipeline(pipeline, paginateOptions) {
    const options = paginateOptions || {currentPage: this.page, limit: this.limit}
    return mongoose.aggregatePaginate(pipeline, options)
  }
}

class Repository {
  selectModel = new Map();
  
  constructor(modelName) {
    this.selectModel = model.get(modelName)
  }

  static async create(modelName) {
    const repo = new Repository(modelName);
    await repo.loadModels(); // Await the asynchronous loading of models
    return repo; // Return the fully initialized instance
  }

   async loadModels() {
    // Perform async operations here
  }
}


export { QueryHelper, Repository }

// This is the goto structure when querying within repository for btees
async paginatedRevenueRecognition(req) {
  try {
    // defaults
    let conditions = {};
    let and_clauses = [{isDeleted: false}]
    const page = req.body?.currentPage || 1;
    const limit = this?.limit || 10;

    // conditions

    if(_.has(req.body, 'status' && !_.isEmpty(req.body.status) )) {
      // push to the and_clauses
       and_clauses.push({
          $or: [
            {
              isCancelled: req.body.status === "active" ? false : true,
            },
          ],
        });
    }

    // add and_clauses to $and

    conditions["$and"] = and_clauses;

    // aggregations

    const aggregations = Subscription.aggregate([])

    const options = {}; // TODO: DRY issue

    // query to the database using mongoose-aggregate-paginate and paginate the resulting documents from db

    const result = await Subscription.aggregatePaginate(aggregations, options);

    // output

    return result || null;
    
  } catch (error) {
    console.error("ERROR: ", error)
    throw error;
  }
}


async function main() {
  try {
    const repo = await Repository.create('someModelName');
    // Use the repo instance as needed
  } catch (error) {
    console.error("Error creating repository:", error);
  }
}

main();


