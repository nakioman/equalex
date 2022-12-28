import { Col, Divider, Layout, Row, Space, Typography } from "antd";
import Image from 'next/image';
import { FaDocker, FaGithub, FaHeart } from 'react-icons/fa';

function Footer() {
    const { Footer: AntFooter } = Layout;
    const { Link } = Typography;
    const year = new Date().getFullYear();
    return (
        <AntFooter style={{ padding: "5px 25px" }} >
            <Row justify="space-between" >
                <Col xs={24} md={12} lg={12}>
                    &copy; {year}, made with&nbsp;
                    {<FaHeart color="red" title="love" />} by&nbsp;
                    <a href="https://nachoglinsek.me" rel="noreferrer" target="_blank">
                        Ignacio Glinsek
                    </a>&nbsp;
                    in&nbsp;<Image
                        src="/img/argentina.svg"
                        alt="Argentina"
                        width={20}
                        height={12.5}
                    />
                </Col>
                <Col >
                    <Space split={<Divider type="vertical" />}>
                        <Link href="https://github.com/nakioman/equalex/" rel="noreferrer" target="_blank">
                            <FaGithub title="Github" />
                        </Link>
                        <Link href="https://hub.docker.com/r/iglinsek/equalex" rel="noreferrer" target="_blank">
                            <FaDocker title="Docker" />
                        </Link>
                    </Space>
                </Col>
            </Row>
        </AntFooter>
    );
}

export default Footer;