import React from 'react';
import queryString from 'query-string';

const About = ({ location, match }) => {
  const query = queryString.parse(location.search);

  const detail = query.detail === 'true';

  return (
    <div>
      <h2>About {match.params.name} </h2>
      {detail && 'detail: blahblah'}{' '}
      {/* true이면 'detail: blahblah' 나옴 하나라도 false이면 안나옴*/}
    </div>
  );
};

export default About;
