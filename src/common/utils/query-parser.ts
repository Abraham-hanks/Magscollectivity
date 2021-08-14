import * as moment from 'moment';
import { Op } from 'sequelize';

// TODO: moment is deprecated,
export const parseQueryObj = (query: any, queryFilters?: string[]): any => {

  const params: any = {}
  params.page = query.page ? parseInt(query.page, 10) : 1; // Page defaults to 1
  params.limit = query.limit ? parseInt(query.limit, 10) : 20; // Limit defaults to 20
  params.skip = (params.page - 1) * params.limit;

  // search
  if (query.search)
    params.search = query.search;

  // sort
  const sort_by = query.sort_by || 'created_at';
  const order = query.order || 'desc';
  params.order = [[sort_by, order]];

  // extract filters and add to where query
  params.where = {};

  if (queryFilters && queryFilters.length > 0) {
    queryFilters.forEach((val) => {
      if (query[val])
        params.where[val] = query[val];
    });
  }

  if (query.active)	// boolean value validated by validator
    params.where.active = query.active;

  let start_date = query.start_date;
  let end_date = query.end_date;

  if (start_date) {
    start_date = moment(start_date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    end_date = moment(end_date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    params.where.created_at = {
      [Op.and]: [
        { [Op.gte]: start_date },
        { [Op.lte]: end_date }
      ]
    };
  }
  else if (end_date) {
    end_date = moment(end_date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    params.where.created_at = {
      [Op.and]: [
        { [Op.lte]: end_date }
      ]
    };
  }
  return params;
};
