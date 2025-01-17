import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import { useMediaQuery } from "react-responsive";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import PageWithSkillList from "../../../../components/PageWithSkillList";
import SearchBar from "../../../../components/SearchBar";
import AddSkillListSelector from "../../../../components/AddSkilListSelector";
import { gql } from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import AddOrEditSkillModale from "../../../../components/AddOrEditSkillModale";
import { FetchedSkill } from ".";
import CommonPage from "../../../../components/CommonPage";
import { useNotification } from "../../../../utils/useNotification";
import { i18nContext } from "../../../../utils/i18nContext";

type Skill = {
  id: string;
  name: string;
  UserSkills_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

type SkillSearchResult = {
  Skill: Skill[];
  didYouMeanSearch: Skill[];
};

const SKILLS_AND_APPETITE_QUERY = gql`
  query getSkillsAndTechnicalAppetitesByCategory2(
    $email: String!
    $category: String!
  ) {
    Category(where: { label: { _eq: $category } }) {
      color
      id
      Skills(
        where: {
          UserSkills: { userEmail: { _eq: $email } }
          _and: { Category: { label: { _eq: $category } } }
        }
      ) {
        id
        name
        UserSkills(order_by: { created_at: desc }, limit: 1) {
          level
        }
        TechnicalAppetites(order_by: { created_at: desc }, limit: 1) {
          level
        }
      }
    }
  }
`;

const SKILL_SEARCH_QUERY = gql`
  query getSkillsByCategory(
    $search: String!
    $category: String!
    $email: String!
    $didYouMeanSearch: String!
  ) {
    Skill(
      where: {
        Category: { label: { _eq: $category } }
        name: { _ilike: $search }
      }
    ) {
      name
      id
      UserSkills_aggregate(where: { User: { email: { _eq: $email } } }) {
        aggregate {
          count
        }
      }
    }
    didYouMeanSearch: Skill(
      where: {
        Category: { label: { _eq: $category } }
        name: { _similar: $didYouMeanSearch }
      }
    ) {
      name
      id
      UserSkills_aggregate(where: { User: { email: { _eq: $email } } }) {
        aggregate {
          count
        }
      }
    }
  }
`;

const ADD_SKILL_MUTATION = gql`
  mutation addUserSkill(
    $email: String!
    $skillId: uuid!
    $level: Int!
    $desire: Int!
  ) {
    insert_UserSkill(
      objects: { skillId: $skillId, level: $level, userEmail: $email }
      on_conflict: { constraint: UserSkill_pkey, update_columns: level }
    ) {
      affected_rows
    }
    insert_TechnicalAppetite(
      objects: { skillId: $skillId, level: $desire, userEmail: $email }
      on_conflict: { constraint: TechnicalAppetite_pkey, update_columns: level }
    ) {
      affected_rows
    }
  }
`;

const computeDidYouMeanSearchString = (search: string) => {
  const searches: string[] = [];
  for (let i = 0; i < Math.floor(search.length / 2); ++i) {
    const subString = search.substring(i * 2, i * 2 + 2);
    searches.push(`${subString[0].toLowerCase()}${subString[1].toLowerCase()}`);
    searches.push(`${subString[0].toUpperCase()}${subString[1].toLowerCase()}`);
    searches.push(`${subString[0].toLowerCase()}${subString[1].toUpperCase()}`);
    searches.push(`${subString[0].toUpperCase()}${subString[1].toUpperCase()}`);
  }
  return `%(${searches.join("|")})%`;
};

const AddSkill = () => {
  const router = useRouter();
  const { user } = useAuth0();
  const { t } = useContext(i18nContext);
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1280px)",
  });
  const { context, category } = router.query;
  if (context === "zenika") {
    router.push(`/skills/${context}/${category}`);
  }
  const [search, setSearch] = useState("");
  const [modaleOpened, setModaleOpened] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>(
    undefined
  );
  const { data, refetch } = useQuery<{
    Category: { color: string; id: string; Skills: FetchedSkill[] };
  }>(SKILLS_AND_APPETITE_QUERY, {
    variables: { email: user.email, category: category || "" },
    fetchPolicy: "network-only",
  });
  const [debouncedSearchValue] = useDebounce(search, 500);
  const {
    data: skillsData,
    refetch: refetchSearch,
  } = useQuery<SkillSearchResult>(SKILL_SEARCH_QUERY, {
    variables: {
      category,
      search: `%${debouncedSearchValue}%`,
      email: user?.email,
      didYouMeanSearch: computeDidYouMeanSearchString(debouncedSearchValue),
    },
    fetchPolicy: "network-only",
  });
  const [addSkill, { error: mutationError }] = useMutation(ADD_SKILL_MUTATION, {
    onCompleted: (_) => {
      useNotification(
        t("skills.addSkillSuccess").replace("%skill%", selectedSkill?.name),
        "green",
        5000
      );
      setSelectedSkill(undefined);
      refetchSearch({ category, search: `%${debouncedSearchValue}%` });
      refetch({
        category,
        search: `%${debouncedSearchValue}%`,
        email: user?.email,
      });
    },
  });
  const preAddAction = (skill: Skill) => {
    setSelectedSkill(skill);
    setModaleOpened(true);
  };

  const addAction = ({ id, name, level, desire }) => {
    setModaleOpened(false);
    addSkill({
      variables: {
        skillId: id,
        email: user?.email,
        level,
        desire,
      },
    });
  };

  if (mutationError) {
    console.error("Error adding skill", mutationError);
  }
  const radarData = data?.Category[0]?.Skills?.map((skill) => ({
    x: skill.UserSkills[0]?.level,
    y: skill.TechnicalAppetites[0]?.level,
    weight: 65,
    labels: [skill.name],
    name: skill.name,
  })).sort((a, b) => -(a.x + a.y - (b.x + b.y)));
  const categoryId = data?.Category[0]?.id;

  return (
    <CommonPage page={category} faded={modaleOpened} context={context}>
      <PageWithSkillList
        context={context}
        category={category}
        add={true}
        faded={modaleOpened}
        data={radarData}
        color={data?.Category[0].color}
      >
        <div>
          <div
            className={`z-20 fixed inset-y-0 right-0 h-screen w-full ${
              modaleOpened ? "" : "hidden"
            }`}
          >
            {selectedSkill ? (
              <div className="flex flex-row justify-center">
                <AddOrEditSkillModale
                  skill={selectedSkill}
                  cancel={() => setModaleOpened(false)}
                  callback={addAction}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div
            className={`flex flex-col ${isDesktop ? "h-radar" : ""} p-2 z-10 ${
              modaleOpened ? "opacity-25" : ""
            }`}
          >
            <SearchBar setSearch={setSearch} />
            <AddSkillListSelector
              action={preAddAction}
              skills={skillsData?.Skill.filter(
                (skill) => skill.UserSkills_aggregate.aggregate.count === 0
              )}
              categoryId={categoryId}
              search={debouncedSearchValue}
              didYouMeanSkills={skillsData?.didYouMeanSearch.filter(
                (skill) => skill.UserSkills_aggregate.aggregate.count === 0
              )}
            />
          </div>
        </div>
      </PageWithSkillList>
    </CommonPage>
  );
};

export default withAuthenticationRequired(AddSkill);
