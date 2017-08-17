import React from 'react';

// state 나 라이프사이클 API 를 전혀 사용하지 않을 때, 그리고 해당 컴포넌트는 자체 기능은 따로 없고 props 가 들어가면 뷰가 나온다는 것을 명시하기 위해 사용합니다.
const Home = () => {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
};

export default Home;
